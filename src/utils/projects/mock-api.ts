// TEMPORARY SEAM. Everything in this file stands in for the backend.
// It keeps projects in memory (a page refresh loses them) and fakes the AI
// drafting with timers. Replace `createProject`, `useProject` and `projectApi`
// with real server calls; the screens only talk to these names.

import type {
  Presenter,
  Project,
  ProjectMode,
  Ratio,
  Scene,
  StillKind,
} from '#/types/project-types'
import { useSyncExternalStore } from 'react'

export const SUGGESTED_PRESENTERS: Presenter[] = [
  {
    id: 'amara',
    name: 'Amara',
    vibe: 'Warm, conversational',
    gradient: 'linear-gradient(160deg,#c084fc,#6d28d9)',
  },
  {
    id: 'daniel',
    name: 'Daniel',
    vibe: 'Calm, credible',
    gradient: 'linear-gradient(160deg,#5eead4,#0f766e)',
  },
  {
    id: 'sofia',
    name: 'Sofia',
    vibe: 'Upbeat, energetic',
    gradient: 'linear-gradient(160deg,#fcd34d,#b45309)',
  },
]

// Fake "photo analysis" result. The real one comes from the vision model.
const MOCK_ANALYSIS = {
  label: 'a vitamin C serum bottle',
  productName: 'Vitamin C serum',
  category: 'Skincare',
}

type SceneSeed = Omit<Scene, 'id' | 'updating'>

const UGC_SCRIPT: SceneSeed[] = [
  {
    title: 'Hook',
    action:
      'Opens on the presenter holding the product up to the camera, close and direct, like talking to a friend.',
    line: 'I almost gave up on my skin. Then a friend handed me this.',
    caption: 'Dull skin? Watch this.',
    seconds: 6,
    still: 'presenter',
  },
  {
    title: 'The problem',
    action:
      'Quick cut to the presenter at a mirror, touching their cheek and frowning.',
    line: 'Every morning it looked tired, no matter what I tried.',
    caption: 'Tried everything',
    seconds: 6,
    still: 'presenter-close',
  },
  {
    title: 'The product',
    action:
      'Close-up of the product being used, light catching the texture, then a clean finish.',
    line: 'Two weeks in and people keep asking what I changed.',
    caption: 'See the difference',
    seconds: 6,
    still: 'product',
  },
  {
    title: 'Call to action',
    action:
      'Back to the camera, product in hand, smiling and pointing down to the link.',
    line: 'Try it for yourself. The link is right below.',
    caption: 'Shop now',
    seconds: 6,
    still: 'presenter',
  },
]

const PHOTO_SCRIPT: SceneSeed[] = [
  {
    title: 'Hook',
    action: 'The product appears on a clean background with a slow push-in.',
    line: 'Meet the one product your routine has been missing.',
    caption: 'Meet your new favourite',
    seconds: 6,
    still: 'product',
  },
  {
    title: 'The detail',
    action:
      'Close-up on the label and texture, light sweeping across the surface.',
    line: 'Made with the good stuff, and you can see it.',
    caption: 'Made with care',
    seconds: 6,
    still: 'product',
  },
  {
    title: 'The benefit',
    action: 'The product in use, with a gentle cut to the result.',
    line: 'Simple to use, easy to love.',
    caption: 'Simple to use',
    seconds: 6,
    still: 'product',
  },
  {
    title: 'Call to action',
    action: 'Final shot of the product centred, with the offer on screen.',
    line: 'Get yours today.',
    caption: 'Shop now',
    seconds: 6,
    still: 'product',
  },
]

const projects = new Map<string, Project>()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function patch(id: string, fn: (p: Project) => Project) {
  const current = projects.get(id)
  if (!current) return
  projects.set(id, fn(current))
  emit()
}

function toScene(seed: SceneSeed): Scene {
  return { ...seed, id: crypto.randomUUID(), updating: false }
}

export type NewProjectInput = {
  idea: string
  images: File[]
  useAvatar: boolean
  ratio: Ratio
  versions: number
}

export function createProject(input: NewProjectInput): string {
  const id = crypto.randomUUID()
  const mode: ProjectMode = input.useAvatar ? 'ugc' : 'photo'
  const script = mode === 'ugc' ? UGC_SCRIPT : PHOTO_SCRIPT

  projects.set(id, {
    id,
    name: 'Untitled ad',
    mode,
    status: 'drafting',
    brief: {
      idea: input.idea,
      photoUrls: input.images.map((f) => URL.createObjectURL(f)),
      platform: null,
      tone: null,
      questionsDone: false,
    },
    analysis: null,
    scenes: [],
    plannedScenes: script.length,
    presenterId: mode === 'ugc' ? SUGGESTED_PRESENTERS[0].id : null,
    ratio: input.ratio,
    versions: input.versions,
  })
  emit()

  // Fake the AI: photo is read first, then scenes arrive one by one.
  setTimeout(() => {
    patch(id, (p) => ({
      ...p,
      analysis: { ...MOCK_ANALYSIS, confirmed: false },
    }))
  }, 900)
  script.forEach((seed, i) => {
    setTimeout(
      () => {
        patch(id, (p) => ({ ...p, scenes: [...p.scenes, toScene(seed)] }))
      },
      1900 + i * 1100,
    )
  })
  setTimeout(
    () => {
      patch(id, (p) => ({
        ...p,
        status: 'ready',
        name: `${p.analysis?.productName ?? 'Your product'} ad`,
      }))
    },
    1900 + script.length * 1100,
  )

  return id
}

export function useProject(id: string): Project | undefined {
  return useSyncExternalStore(
    subscribe,
    () => projects.get(id),
    () => undefined,
  )
}

export const projectApi = {
  updateBrief(
    id: string,
    next: Partial<
      Pick<Project['brief'], 'platform' | 'tone' | 'questionsDone'>
    >,
  ) {
    patch(id, (p) => ({ ...p, brief: { ...p.brief, ...next } }))
  },

  updateAnalysis(
    id: string,
    next: Partial<{ productName: string; confirmed: boolean }>,
  ) {
    patch(id, (p) =>
      p.analysis ? { ...p, analysis: { ...p.analysis, ...next } } : p,
    )
  },

  setPresenter(id: string, presenterId: string | null) {
    patch(id, (p) => ({ ...p, presenterId }))
  },

  setSceneSeconds(id: string, sceneId: string, seconds: number) {
    patch(id, (p) => ({
      ...p,
      scenes: p.scenes.map((s) => (s.id === sceneId ? { ...s, seconds } : s)),
    }))
  },

  setSceneLine(id: string, sceneId: string, line: string) {
    patch(id, (p) => ({
      ...p,
      scenes: p.scenes.map((s) => (s.id === sceneId ? { ...s, line } : s)),
    }))
  },

  moveScene(id: string, sceneId: string, direction: -1 | 1) {
    patch(id, (p) => {
      const from = p.scenes.findIndex((s) => s.id === sceneId)
      const to = from + direction
      if (from < 0 || to < 0 || to >= p.scenes.length) return p
      const scenes = p.scenes.slice()
      const [moved] = scenes.splice(from, 1)
      scenes.splice(to, 0, moved)
      return { ...p, scenes }
    })
  },

  duplicateScene(id: string, sceneId: string) {
    patch(id, (p) => {
      const i = p.scenes.findIndex((s) => s.id === sceneId)
      if (i < 0) return p
      const copy = { ...p.scenes[i], id: crypto.randomUUID() }
      const scenes = p.scenes.slice()
      scenes.splice(i + 1, 0, copy)
      return { ...p, scenes }
    })
  },

  deleteScene(id: string, sceneId: string) {
    patch(id, (p) =>
      p.scenes.length <= 1
        ? p
        : { ...p, scenes: p.scenes.filter((s) => s.id !== sceneId) },
    )
  },

  addScene(id: string) {
    patch(id, (p) => ({
      ...p,
      scenes: [
        ...p.scenes,
        toScene({
          title: 'New scene',
          action: 'Tell us what should happen in this scene.',
          line: '',
          caption: '',
          seconds: 6,
          still: 'product' as StillKind,
        }),
      ],
    }))
  },

  /** Fake "Change this scene…": the real version sends the instruction to the AI. */
  requestSceneChange(id: string, sceneId: string, instruction: string) {
    patch(id, (p) => ({
      ...p,
      scenes: p.scenes.map((s) =>
        s.id === sceneId ? { ...s, updating: true } : s,
      ),
    }))
    setTimeout(() => {
      patch(id, (p) => ({
        ...p,
        scenes: p.scenes.map((s) =>
          s.id === sceneId
            ? {
                ...s,
                updating: false,
                action:
                  instruction.trim().charAt(0).toUpperCase() +
                  instruction.trim().slice(1),
              }
            : s,
        ),
      }))
    }, 1200)
  },
}
