import db from '#/db'
import { project } from '#/db/schemas/project.schema'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { count, eq, max } from 'drizzle-orm'
import { scene } from '#/db/schemas/scene.schema'
import { DEFAULT_SCENE_SECONDS, MAX_SCENES } from '..'
import { projectId } from './schema'
import { lockProject } from '../helpers'

export const addScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(projectId)
  .handler(async ({ data, context }) => {
    return db.transaction(async (tx) => {
      const p = await lockProject(tx, data.projectId, context.user.id)

      const [stats] = await tx
        .select({ total: count(), maxPosition: max(scene.position) })
        .from(scene)
        .where(eq(scene.projectId, p.id))

      if (stats.total >= MAX_SCENES) {
        throw new Error(`A storyboard can have at most ${MAX_SCENES} scenes`)
      }

      const [row] = await tx
        .insert(scene)
        .values({
          projectId: p.id,
          position: (stats.maxPosition ?? -1) + 1,
          seconds: DEFAULT_SCENE_SECONDS,
        })
        .returning({ id: scene.id })

      await tx
        .update(project)
        .set({ updatedAt: new Date() })
        .where(eq(project.id, p.id))

      return { id: row.id }
    })
  })
