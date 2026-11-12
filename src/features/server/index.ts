import db from '#/db'
import { project, scene } from '#/db/schema'
import { and, eq } from 'drizzle-orm'
import { userLiveProjects } from './helpers'

const MIN_SCENE_SECONDS = 3
const MAX_SCENE_SECONDS = 8
export const DEFAULT_SCENE_SECONDS = 5
export const MAX_SCENES = 8 // placeholder cap

export async function requireProject(projectId: string, userId: string) {
  const row = await db.query.project.findFirst({
    where: (p, { and, eq, isNull }) =>
      and(eq(p.id, projectId), eq(p.userId, userId), isNull(p.deletedAt)),
  })

  if (!row) throw new Error('Project not found')
  return row
}

export async function requireScene(sceneId: string, userId: string) {
  const [row] = await db
    .select({
      id: scene.id,
      projectId: scene.projectId,
      position: scene.position,
      spokenLine: scene.spokenLine,
      visual: scene.visual,
      seconds: scene.seconds,
      stillAssetId: scene.stillAssetId,
    })
    .from(scene)
    .innerJoin(project, eq(project.id, scene.projectId))
    .where(and(eq(scene.id, sceneId), userLiveProjects(userId)))
    .limit(1)

  if (!row) throw new Error('Scene not found')
  return row
}

export const clampSeconds = (n: number) =>
  Math.min(MAX_SCENE_SECONDS, Math.max(MIN_SCENE_SECONDS, Math.round(n)))
