import db from '#/db'
import { project } from '#/db/schemas/project.schema'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { and, count, eq, isNull, max } from 'drizzle-orm'
import { scene } from '#/db/schemas/scene.schema'
import { DEFAULT_SCENE_SECONDS, MAX_SCENES } from '..'
import { projectId } from './schema'

export const addScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(projectId)
  .handler(async ({ data, context }) => {
    return db.transaction(async (tx) => {
      // 1. Lock and authorize the project.
      const [ownedProject] = await tx
        .select({ id: project.id })
        .from(project)
        .where(
          and(
            eq(project.id, data.projectId),
            eq(project.userId, context.user.id),
            isNull(project.deletedAt),
          ),
        )
        .for('update')
        .limit(1)

      if (!ownedProject) {
        throw new Error('Project not found')
      }

      // 2. Get the scene count and highest position.
      const [stats] = await tx
        .select({
          total: count(),
          maxPosition: max(scene.position),
        })
        .from(scene)
        .where(eq(scene.projectId, data.projectId))

      // 3. Enforce the scene limit.
      if (stats.total >= MAX_SCENES) {
        throw new Error(`A storyboard can have at most ${MAX_SCENES} scenes`)
      }

      // 4. Calculate the next position.
      const nextPosition = (stats.maxPosition ?? -1) + 1

      // 5. Insert the scene.
      const [row] = await tx
        .insert(scene)
        .values({
          projectId: data.projectId,
          position: nextPosition,
          seconds: DEFAULT_SCENE_SECONDS,
        })
        .returning({ id: scene.id })

      // 6. Update the project timestamp.
      await tx
        .update(project)
        .set({ updatedAt: new Date() })
        .where(eq(project.id, data.projectId))

      return { id: row.id }
    })
  })
