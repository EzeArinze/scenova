import { TONES } from '../product-art'
import type { SceneVariant, Tone } from '../product-art'

export const FIRST_VERSION = 3
export const REGENERATE_MS = 1100
export const PARALLAX_RANGE = 1
export const SPRING = { stiffness: 120, damping: 20, mass: 0.4 }

export const cardSurface = 'bg-card shadow-raised ring-1 ring-ink-900/5'

export const SCENES: Array<{
  label: string
  tone: Tone
  variant: SceneVariant
}> = [
  { label: 'Hook', tone: TONES[1], variant: 'hook' },
  { label: 'Benefits', tone: TONES[2], variant: 'detail' }, // replaced by live scene 2
  { label: 'Lifestyle', tone: TONES[3], variant: 'detail' },
  { label: 'CTA', tone: TONES[0], variant: 'cta' },
]
