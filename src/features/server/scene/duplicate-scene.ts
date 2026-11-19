import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { MAX_SCENES } from '..'
import db from '#/db'
import { scene } from '#/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { lockProjectByScene } from '../helpers'
import { sceneId } from './schema'

export const duplicateScene = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(sceneId)
  .handler(async ({ data, context }) => {
    return db.transaction(async (tx) => {
      // 1. Lock the owning project, check ownership + not trashed, bump updatedAt.
      const p = await lockProjectByScene(tx, data.sceneId, context.user.id)

      // 2. Fresh read of the scene plus the scene count, in one query.
      const [s] = await tx
        .select({
          projectId: scene.projectId,
          position: scene.position,
          spokenLine: scene.spokenLine,
          visual: scene.visual,
          seconds: scene.seconds,
          stillAssetId: scene.stillAssetId,
          total: tx.$count(scene, eq(scene.projectId, p.id)),
        })
        .from(scene)
        .where(eq(scene.id, data.sceneId))

      if (!s) throw new Error('Scene not found')
      if (s.total >= MAX_SCENES) {
        throw new Error(`A storyboard can have at most ${MAX_SCENES} scenes`)
      }

      // 3. Make room right after the original.
      await tx
        .update(scene)
        .set({ position: sql`${scene.position} + 1` })
        .where(
          and(
            eq(scene.projectId, p.id),
            sql`${scene.position} > ${s.position}`,
          ),
        )

      // 4. Insert the copy.
      const [row] = await tx
        .insert(scene)
        .values({
          projectId: p.id,
          position: s.position + 1,
          spokenLine: s.spokenLine,
          visual: s.visual,
          seconds: s.seconds,
          stillAssetId: s.stillAssetId,
        })
        .returning({ id: scene.id })

      return { id: row.id }
    })
  })
