/** PLACEHOLDER pricing: replace with the real per-second cost of the video engine. */
export const CREDITS_PER_SECOND = 1

/** Assumed clip limits (8s clips). Confirm against the real engine. */
export const MIN_SCENE_SECONDS = 3
export const MAX_SCENE_SECONDS = 8

export function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function creditsFor(totalSeconds: number, versions: number) {
  return totalSeconds * CREDITS_PER_SECOND * versions
}
