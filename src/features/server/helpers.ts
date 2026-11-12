import type db from '#/db'
import { project, scene } from '#/db/schema'
import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm'

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** Projects that are not in the trash. */
export const liveProjects = isNull(project.deletedAt)

/** Projects that are in the trash. */
export const trashedProjects = isNotNull(project.deletedAt)

/** Live projects owned by a specific user. */
export const userLiveProjects = (userId: string) =>
  and(eq(project.userId, userId), liveProjects)

/** Lock a live project the user owns. Throws if missing, not theirs, or trashed. */
export async function lockProject(tx: Tx, projectId: string, userId: string) {
  const [p] = await tx
    .select({ id: project.id })
    .from(project)
    .where(and(eq(project.id, projectId), userLiveProjects(userId)))
    .for('update')

  if (!p) throw new Error('Project not found')
  return p
}

/** Same, but starting from a scene id (duplicate, move, delete, update scene). */
export async function lockProjectByScene(
  tx: Tx,
  sceneId: string,
  userId: string,
) {
  const [p] = await tx
    .select({ id: project.id })
    .from(project)
    .where(
      and(
        eq(
          project.id,
          sql`(select ${scene.projectId} from ${scene} where ${scene.id} = ${sceneId})`,
        ),
        userLiveProjects(userId),
      ),
    )
    .for('update')

  if (!p) throw new Error('Scene not found')
  return p
}
