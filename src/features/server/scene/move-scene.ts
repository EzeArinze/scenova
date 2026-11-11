import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { requireScene } from '../projects'
import db from '#/db'
import { project, scene } from '#/db/schema'
import { asc, eq } from 'drizzle-orm'
import z from 'zod'

const moveSceneSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(['up', 'down']),
})

export const moveScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(moveSceneSchema)
  .handler(async ({ data, context }) => {
    const s = await requireScene(data.id, context.user.id)
    await db.transaction(async (tx) => {
      const list = await tx
        .select({ id: scene.id, position: scene.position })
        .from(scene)
        .where(eq(scene.projectId, s.projectId))
        .orderBy(asc(scene.position), asc(scene.createdAt))

      const from = list.findIndex((r) => r.id === s.id)
      const to = data.direction === 'up' ? from - 1 : from + 1
      if (from < 0 || to < 0 || to >= list.length) return

      const next = [...list]
      ;[next[from], next[to]] = [next[to], next[from]]

      // Renumber 0..n-1 so gaps left by deletes are cleaned up too.
      for (let i = 0; i < next.length; i++) {
        if (next[i].position !== i) {
          await tx
            .update(scene)
            .set({ position: i })
            .where(eq(scene.id, next[i].id))
        }
      }
      await tx
        .update(project)
        .set({ updatedAt: new Date() })
        .where(eq(project.id, s.projectId))
    })
    return { ok: true as const }
  })
