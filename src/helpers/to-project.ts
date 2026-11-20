import type {
  Platform,
  Presenter,
  Project,
  ProjectMode,
  Ratio,
  Scene,
  Tone,
} from '#/types/project-types'
import { PLATFORM_VALUES, TONE_VALUES } from '#/utils/projects/constants'

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
  title: string
  spokenLine: string
  visual: string
  caption: string
  seconds: number
}

export type PresenterRowInput = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
}

// The database stores these answers as free strings; the screens only know
// the listed values. Anything else is treated as "not answered".
function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | null {
  return allowed.find((a) => a === value) ?? null
}

/** "a vitamin C serum bottle" -> "Vitamin C serum bottle". */
function nameFromLabel(label: string) {
  const bare = label.replace(/^(a|an|the)\s+/i, '').trim()
  return bare ? bare.charAt(0).toUpperCase() + bare.slice(1) : label
}

function toSceneView(row: SceneRowInput, index: number, p: ProjectRowInput) {
  const scene: Scene = {
    id: row.id,
    title: row.title.trim() || `Scene ${index + 1}`,
    action: row.visual,
    line: row.spokenLine,
    caption: row.caption,
    seconds: row.seconds,
    // Placeholder art until real generated stills exist.
    still: p.mode === 'ugc' && p.presenterId ? 'presenter' : 'product',
    updating: false,
  }
  return scene
}

// Stable colour for a presenter with no image, so the card is never blank.
function gradientFor(id: string) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const hue = h % 360
  return `linear-gradient(160deg,hsl(${hue} 70% 65%),hsl(${(hue + 40) % 360} 70% 35%))`
}

export function toPresenterView(row: PresenterRowInput): Presenter {
  return {
    id: row.id,
    name: row.name,
    vibe: row.description ?? '',
    gradient: gradientFor(row.id),
    imageUrl: row.imageUrl,
  }
}

/**
 * Returns null for projects past the storyboard (generating, done): those
 * screens do not exist yet, and the caller decides what to show instead.
 * Scenes are used in the order given; the server already sorts them.
 */
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
      platform: oneOf<Platform>(a.platform, PLATFORM_VALUES),
      tone: oneOf<Tone>(a.tone, TONE_VALUES),
      questionsDone: a.questionsDone === true,
    },
    // Null until the photo has been read.
    analysis: a.label
      ? {
          label: a.label,
          // Until the user names it, use the photo label instead of a blank.
          productName: a.productName?.trim() || nameFromLabel(a.label),
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
