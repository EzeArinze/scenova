import type { StillKind } from '#/types/project-types'
import { cn } from 'cn'

// PLACEHOLDER art. Swap for the real generated still (an <img>) when it exists.
const GRADIENTS = [
  'from-[#3b2a7a] to-[#0c0a18]',
  'from-[#1f3a4d] to-[#0a0f14]',
  'from-[#4a2a6b] to-[#120a1c]',
  'from-[#2c3a7a] to-[#0a0c18]',
]

export function SceneStill({
  kind,
  index,
  label,
  className,
}: {
  kind: StillKind
  index: number
  label: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'relative overflow-hidden rounded-xl bg-linear-to-b',
        GRADIENTS[index % GRADIENTS.length],
        className,
      )}
    >
      <svg
        viewBox="0 0 96 170"
        aria-hidden
        className="absolute inset-0 size-full"
      >
        {kind === 'presenter' && (
          <>
            <circle cx="48" cy="66" r="16" fill="rgba(255,255,255,0.85)" />
            <path
              d="M14 170C14 120 82 120 82 170Z"
              fill="rgba(255,255,255,0.85)"
            />
            <rect x="62" y="104" width="14" height="30" rx="3" fill="#8b6cff" />
            <rect x="65" y="98" width="8" height="8" rx="2" fill="#ddd6fe" />
          </>
        )}
        {kind === 'presenter-close' && (
          <>
            <rect
              x="12"
              y="22"
              width="72"
              height="104"
              rx="36"
              fill="rgba(255,255,255,0.12)"
            />
            <circle cx="48" cy="72" r="14" fill="rgba(255,255,255,0.85)" />
            <path
              d="M20 170C20 128 76 128 76 170Z"
              fill="rgba(255,255,255,0.85)"
            />
          </>
        )}
        {kind === 'product' && (
          <>
            <rect x="34" y="62" width="28" height="64" rx="8" fill="#8b6cff" />
            <rect x="42" y="44" width="12" height="20" rx="3" fill="#ddd6fe" />
            <rect x="45" y="30" width="6" height="16" rx="3" fill="#ddd6fe" />
            <circle cx="48" cy="140" r="3" fill="rgba(255,255,255,0.8)" />
            <circle cx="58" cy="148" r="2" fill="rgba(255,255,255,0.6)" />
          </>
        )}
      </svg>
    </div>
  )
}
