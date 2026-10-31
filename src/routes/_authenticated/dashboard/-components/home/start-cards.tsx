import { ImageIcon, LayoutTemplate, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from 'cn'
import { rise } from '#/utils/dashboard-contants'

export type StartAction = 'photo' | 'avatar' | 'template'

type StartCard = {
  action: StartAction
  title: string
  description: string
  icon: LucideIcon
  tone: string
}

const CARDS: StartCard[] = [
  {
    action: 'photo',
    title: 'Ad from a product photo',
    description: 'Upload one image and get a short ad video.',
    icon: ImageIcon,
    tone: 'bg-violet-500/15 text-violet-400',
  },
  {
    action: 'avatar',
    title: 'UGC with an avatar',
    description: 'Pick an avatar to present your product on camera.',
    icon: UserRound,
    tone: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    action: 'template',
    title: 'Start from a template',
    description: 'Begin with a proven ad structure and swap in your product.',
    icon: LayoutTemplate,
    tone: 'bg-amber-500/15 text-amber-400',
  },
]

// Hover only on fine pointers, so touch screens never get a stuck hover state.
const FINE_HOVER =
  '[@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100'

export function StartCards({
  onPick,
  className,
}: {
  onPick: (action: StartAction) => void
  className?: string
}) {
  return (
    <div
      className={cn('grid w-full grid-cols-1 gap-3 sm:grid-cols-3', className)}
    >
      {CARDS.map(({ action, title, description, icon: Icon, tone }) => (
        <motion.div key={action} variants={rise} className="flex">
          <button
            type="button"
            onClick={() => onPick(action)}
            className="group relative flex w-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-[scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98]"
          >
            {/* Border highlight fades in with opacity, not a colour transition */}
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit] border border-foreground/20 opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                FINE_HOVER,
              )}
            />
            <span
              className={cn('grid size-10 place-items-center rounded-xl', tone)}
            >
              <Icon aria-hidden className="size-5" />
            </span>
            <span className="space-y-1">
              <span className="block text-sm font-semibold text-foreground">
                {title}
              </span>
              <span className="block text-sm leading-snug text-muted-foreground">
                {description}
              </span>
            </span>
          </button>
        </motion.div>
      ))}
    </div>
  )
}
