import type { Platform, Tone } from '#/types/project-types'

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'reels', label: 'Instagram Reels' },
  { value: 'shorts', label: 'YouTube Shorts' },
  { value: 'instagram', label: 'Instagram' },
]

export const TONES: { value: Tone; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'premium', label: 'Calm and premium' },
  { value: 'funny', label: 'Funny' },
]
