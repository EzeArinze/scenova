import type db from '#/db'
import { project, scene } from '#/db/schema'
import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm'
import type {
  Platform,
  Project,
  ProjectMode,
  Ratio,
  Scene,
  Tone,
} from '#/types/project-types'

const PLATFORMS: readonly Platform[] = [
  'tiktok',
  'reels',
  'shorts',
  'instagram',
]
const TONES: readonly Tone[] = ['casual', 'energetic', 'premium', 'funny']

/** How many scene skeletons to show while the draft is still arriving. */
const PLANNED_SCENES = 4

export type ProjectRowInput = {
  id: string
  title: string
  mode: ProjectMode
  status: 'drafting' | 'ready' | 'generating' | 'done'
  brief: string
  settings: { ratio: Ratio; variations: number }
  analysis: {
    label?: string
    productName?: string
    category?: string
    confirmed?: boolean
    platform?: string
    tone?: string
    questionsDone?: boolean
  }
  presenterId: string | null
}

export type SceneRowInput = {
  id: string
  spokenLine: string
  visual: string
  seconds: number
}

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export const liveProjects = isNull(project.deletedAt)

export const trashedProjects = isNotNull(project.deletedAt)

export const userLiveProjects = (userId: string) =>
  and(eq(project.userId, userId), liveProjects)

export async function lockProject(tx: Tx, projectId: string, userId: string) {
  const [p] = await tx
    .select({ id: project.id })
    .from(project)
    .where(and(eq(project.id, projectId), userLiveProjects(userId)))
    .for('update')

  if (!p) throw new Error('Project not found')
  return p
}

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

// The database stores these answers as free strings; the screens only know
// the listed values. Anything else is treated as "not answered".
function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | null {
  return allowed.find((a) => a === value) ?? null
}

function toSceneView(row: SceneRowInput, index: number, p: ProjectRowInput) {
  const scene: Scene = {
    id: row.id,
    // The scene table has no title or caption yet.
    title: `Scene ${index + 1}`,
    action: row.visual,
    line: row.spokenLine,
    caption: '',
    seconds: row.seconds,
    // Placeholder art until real generated stills exist.
    still: p.mode === 'ugc' && p.presenterId ? 'presenter' : 'product',
    updating: false,
  }
  return scene
}

export function toProjectView(input: {
  project: ProjectRowInput
  scenes: SceneRowInput[]
  photoUrls: string[]
}): Project | null {
  const { project: p, scenes, photoUrls } = input
  if (p.status !== 'drafting' && p.status !== 'ready') return null

  const a = p.analysis

  return {
    id: p.id,
    name: p.title,
    mode: p.mode,
    status: p.status,
    brief: {
      idea: p.brief,
      photoUrls,
      platform: oneOf(a.platform, PLATFORMS),
      tone: oneOf(a.tone, TONES),
      questionsDone: a.questionsDone === true,
    },
    // Null until the photo has been read.
    analysis: a.label
      ? {
          label: a.label,
          productName: a.productName ?? '',
          category: a.category ?? '',
          confirmed: a.confirmed === true,
        }
      : null,
    scenes: scenes.map((row, i) => toSceneView(row, i, p)),
    plannedScenes:
      p.status === 'ready'
        ? scenes.length
        : Math.max(PLANNED_SCENES, scenes.length),
    presenterId: p.presenterId,
    ratio: p.settings.ratio,
    versions: p.settings.variations,
  }
}
