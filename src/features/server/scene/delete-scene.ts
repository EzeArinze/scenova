import db from '#/db'
import { project, scene } from '#/db/schema'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { eq, inArray } from 'drizzle-orm'
import z from 'zod'
import { requireScene } from '..'

export const deleteScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    await db.transaction(async (tx) => {
      const s = await requireScene(data.id, context.user.id)

      if (!s) throw new Error('Scene not found')

      // // 2. Delete the scene.
      // await tx.delete(scene).where(eq(scene.id, s.id))

      // // 3. Update the parent project.
      // await tx
      //   .update(project)
      //   .set({ updatedAt: new Date() })
      //   .where(eq(project.id, s.projectId))

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
