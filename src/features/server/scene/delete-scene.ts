import db from '#/db'
import { project, scene } from '#/db/schema'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { eq, inArray } from 'drizzle-orm'
import { requireScene } from '..'
import { sceneId } from './schema'

export const deleteScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(sceneId)
  .handler(async ({ data, context }) => {
    await db.transaction(async (tx) => {
      const s = await requireScene(data.sceneId, context.user.id)

      if (!s) throw new Error('Scene not found')

      // one round trip for delete and parents update to the db
      const deleted = tx
        .$with('deleted')
        .as(
          tx
            .delete(scene)
            .where(eq(scene.id, s.id))
            .returning({ projectId: scene.projectId }),
        )

      await tx
        .with(deleted)
        .update(project)
        .set({ updatedAt: new Date() })
        .where(
          inArray(
            project.id,
            tx.select({ id: deleted.projectId }).from(deleted),
          ),
        )
    })

    return { ok: true as const }
  })
