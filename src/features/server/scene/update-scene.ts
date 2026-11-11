import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { updateSceneSchema } from './schema'
import { clampSeconds, requireScene } from '..'
import db from '#/db'
import { project, scene } from '#/db/schema'
import { and, eq, isNull } from 'drizzle-orm'

export const updateScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(updateSceneSchema)
  .handler(async ({ data, context }) => {
    const set = {
      ...(data.seconds !== undefined && {
        seconds: clampSeconds(data.seconds),
      }),
      ...(data.spokenLine !== undefined && {
        spokenLine: data.spokenLine,
      }),
      ...(data.visual !== undefined && {
        visual: data.visual,
      }),
    }

    if (Object.keys(set).length === 0) {
      return { ok: true as const }
    }

    await db.transaction(async (tx) => {
      // 1. Verify scene ownership and project availability.
      const s = await requireScene(data.id, context.user.id)

      if (!s) throw new Error('Scene not found')

      // 2. Update the scene.
      await tx.update(scene).set(set).where(eq(scene.id, s.id))

      // 3. Update the parent project's timestamp.
      await tx
        .update(project)
        .set({ updatedAt: new Date() })
        .where(
          and(
            eq(project.id, s.projectId),
            eq(project.userId, context.user.id),
            isNull(project.deletedAt),
          ),
        )
    })

    return { ok: true as const }
  })
