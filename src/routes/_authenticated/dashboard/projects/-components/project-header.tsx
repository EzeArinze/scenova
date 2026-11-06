import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { cn } from 'cn'
import type { ProjectStatus } from '#/types/project-types'

const STEPS = ['Brief', 'Storyboard', 'Render', 'Review'] as const

export function ProjectHeader({
  name,
  status,
}: {
  name: string
  status: ProjectStatus
}) {
  // 0 = Brief, 1 = Storyboard. Render and Review arrive with the next screens.
  const current = status === 'drafting' ? 0 : 1

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pt-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          to="/dashboard/projects"
          className="text-sm text-muted-foreground"
        >
          Projects
        </Link>
        <span aria-hidden className="text-muted-foreground/60">
          /
        </span>
        <h1 className="text-sm font-semibold">{name}</h1>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            status === 'drafting'
              ? 'bg-primary/15 text-primary'
              : 'bg-amber-400/12 text-amber-400',
          )}
        >
          {status === 'drafting' ? 'Drafting' : 'Draft'}
        </span>
      </div>

      <ol className="flex flex-wrap items-center gap-2.5 text-[13px]">
        {STEPS.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li
              key={step}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2.5',
                active
                  ? 'font-semibold text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {i > 0 && <span aria-hidden className="h-px w-5 bg-border" />}
              <span
                className={cn(
                  'grid size-5.5 place-items-center rounded-full text-[11px]',
                  done && 'bg-emerald-400/15 text-emerald-400',
                  active && 'bg-primary text-primary-foreground',
                  !done && !active && 'border border-border',
                )}
              >
                {done ? <Check aria-hidden className="size-3" /> : i + 1}
              </span>
              {step}
            </li>
          )
        })}
      </ol>
    </header>
  )
}
