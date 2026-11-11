import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { MAX_SCENES, requireScene } from '..'
import db from '#/db'
import { project, scene } from '#/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import z from 'zod'

export const duplicateScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const s = await requireScene(data.id, context.user.id)
    return db.transaction(async (tx) => {
      const count = await tx
        .select({ id: scene.id })
        .from(scene)
        .where(eq(scene.projectId, s.projectId))
      if (count.length >= MAX_SCENES) {
        throw new Error(`A storyboard can have at most ${MAX_SCENES} scenes`)
      }
      // Make room right after the original, then insert the copy there.
      await tx
        .update(scene)
        .set({ position: sql`${scene.position} + 1` })
        .where(
          and(
            eq(scene.projectId, s.projectId),
            sql`${scene.position} > ${s.position}`,
          ),
        )
      const [row] = await tx
        .insert(scene)
        .values({
          projectId: s.projectId,
          position: s.position + 1,
          spokenLine: s.spokenLine,
          visual: s.visual,
          seconds: s.seconds,
          stillAssetId: s.stillAssetId,
        })
        .returning({ id: scene.id })
      await tx
        .update(project)
        .set({ updatedAt: new Date() })
        .where(eq(project.id, s.projectId))
      return { id: row.id }
    })
  })
