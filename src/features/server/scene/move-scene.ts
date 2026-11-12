import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import db from '#/db'
import { project, scene } from '#/db/schema'
import { lockProjectByScene } from '../helpers'
import { asc, eq, inArray, sql } from 'drizzle-orm'
import z from 'zod'

const moveSceneSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(['up', 'down']),
})

export const moveScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(moveSceneSchema)
  .handler(async ({ data, context }) => {
    return db.transaction(async (tx) => {
      // 1. Lock the owning project (also checks ownership + not trashed).
      const p = await lockProjectByScene(tx, data.id, context.user.id)

      // 2. Fresh ordered list, now safe from concurrent edits.
      const list = await tx
        .select({ id: scene.id, position: scene.position })
        .from(scene)
        .where(eq(scene.projectId, p.id))
        .orderBy(asc(scene.position), asc(scene.createdAt))

      const from = list.findIndex((r) => r.id === data.id)
      if (from < 0) throw new Error('Scene not found')

      const to = data.direction === 'up' ? from - 1 : from + 1
      if (to < 0 || to >= list.length) return { ok: true as const } // already at the edge

      const next = [...list]
      ;[next[from], next[to]] = [next[to], next[from]]

      // 3. Renumber 0..n-1 in ONE statement, only for rows that changed.
      const changed = next
        .map((r, i) => ({ id: r.id, position: i, old: r.position }))
        .filter((r) => r.position !== r.old)

      if (changed.length > 0) {
        const cases = changed.map(
          (c) => sql`when ${scene.id} = ${c.id} then ${c.position}::int`,
        )
        await tx
          .update(scene)
          .set({ position: sql`(case ${sql.join(cases, sql` `)} end)` })
          .where(
            inArray(
              scene.id,
              changed.map((c) => c.id),
            ),
          )

        // 4. Bump updatedAt only when something actually changed.
        await tx
          .update(project)
          .set({ updatedAt: new Date() })
          .where(eq(project.id, p.id))
      }

      return { ok: true as const }
    })
  })
