export type ProjectMode = 'photo' | 'ugc' | 'template'
export type ProjectStatus = 'drafting' | 'ready'
export type Platform = 'tiktok' | 'reels' | 'shorts' | 'instagram'
export type Tone = 'casual' | 'energetic' | 'premium' | 'funny'
export type Ratio = '9:16' | '1:1' | '16:9'

/** Which placeholder still to draw until real generated frames exist. */
export type StillKind = 'presenter' | 'presenter-close' | 'product'

export type Scene = {
  id: string
  title: string
  /** What happens on screen, in plain words. */
  action: string
  /** Spoken by the presenter, or read as voice-over when there is none. */
  line: string
  /** Short on-screen caption. */
  caption: string
  seconds: number
  still: StillKind
  /** True while a "change this scene" request is being applied. */
  updating: boolean
}

export type ProductAnalysis = {
  /** Shown in the confirm question, e.g. "a vitamin C serum bottle". */
  label: string
  productName: string
  category: string
  confirmed: boolean
}

export type ProjectBrief = {
  idea: string
  photoUrls: string[]
  platform: Platform | null
  tone: Tone | null
  /** True once the user answered or skipped the quick questions. */
  questionsDone: boolean
}

export type Presenter = {
  id: string
  name: string
  vibe: string
  /** CSS gradient used until real avatar portraits exist. */
  gradient: string
}

export type Project = {
  id: string
  name: string
  mode: ProjectMode
  status: ProjectStatus
  brief: ProjectBrief
  /** Null until the photo has been analysed. */
  analysis: ProductAnalysis | null
  scenes: Scene[]
  /** How many scenes the draft will end up with (drives skeletons). */
  plannedScenes: number
  /** Null means no presenter. */
  presenterId: string | null
  ratio: Ratio
  versions: number
}
