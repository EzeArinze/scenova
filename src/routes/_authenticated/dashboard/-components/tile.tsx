import { cn } from 'cn'
import type { LucideIcon } from 'lucide-react'

const TILE_TONES = {
  neutral: 'bg-foreground/6 text-primary ring-foreground/10',
  primary: 'bg-primary text-primary-foreground ring-primary/40',
  destructive: 'bg-destructive/10 text-destructive ring-destructive/20',
} as const

export function Tile({
  icon: Icon,
  tone = 'neutral',
}: {
  icon: LucideIcon
  tone?: keyof typeof TILE_TONES
}) {
  return (
    <span
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-lg shadow-xs ring-1',
        TILE_TONES[tone],
      )}
    >
      <Icon aria-hidden className="size-4" />
    </span>
  )
}
