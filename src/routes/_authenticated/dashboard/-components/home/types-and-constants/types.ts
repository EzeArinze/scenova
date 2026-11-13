import type { Ref } from 'react'
import type { RATIOS } from './constant'

export type ComposerSettings = {
  ratio: (typeof RATIOS)[number]
  seconds: number
  variations: number
}

export type ComposerValue = {
  prompt: string
  images: File[]
  useAvatar: boolean
  settings: ComposerSettings
}

export type PromptComposerHandle = {
  openFilePicker: () => void
  setAvatar: (on: boolean) => void
  focus: () => void
}

export type PromptComposerProps = {
  onSubmit: (draft: ComposerValue) => void
  disabled?: boolean
  ref?: Ref<PromptComposerHandle>
}
