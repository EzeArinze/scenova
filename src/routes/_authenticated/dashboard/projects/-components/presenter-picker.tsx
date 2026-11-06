import { Ban, Check, LayoutGrid } from 'lucide-react'
import { cn } from 'cn'
import type { Presenter } from '#/types/project-types'

const CARD =
  'relative flex min-h-[168px] w-[150px] flex-col items-center rounded-[18px] border p-3 pt-4 transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]'

export function PresenterPicker({
  options,
  value,
  onChange,
  onBrowse,
}: {
  options: Presenter[]
  /** Null means no presenter. */
  value: string | null
  onChange: (id: string | null) => void
  /** Opens the full Avatars library. Hidden until that exists. */
  onBrowse?: () => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((p) => {
        const selected = p.id === value
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(p.id)}
            className={cn(
              CARD,
              'bg-card',
              selected
                ? 'border-primary ring-[3px] ring-primary/25'
                : 'border-border',
            )}
          >
            <span
              aria-hidden
              className="relative block size-18 overflow-hidden rounded-full"
              style={{ background: p.gradient }}
            >
              <svg viewBox="0 0 72 72" className="absolute inset-0 size-full">
                <circle cx="36" cy="28" r="12" fill="rgba(255,255,255,0.88)" />
                <path
                  d="M10 72C10 50 62 50 62 72Z"
                  fill="rgba(255,255,255,0.88)"
                />
              </svg>
            </span>
            {selected && (
              <span className="absolute top-2.5 right-2.5 grid size-5.5 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check aria-hidden className="size-3" />
              </span>
            )}
            <span className="mt-2.5 text-sm font-bold">{p.name}</span>
            <span className="text-center text-xs text-muted-foreground">
              {p.vibe}
            </span>
          </button>
        )
      })}

      {onBrowse && (
        <button
          type="button"
          onClick={onBrowse}
          className={cn(
            CARD,
            'justify-center gap-2.5 border-dashed border-border text-[13px] font-semibold text-muted-foreground',
          )}
        >
          <LayoutGrid aria-hidden className="size-5.5" />
          Browse all
        </button>
      )}

      <button
        type="button"
        aria-pressed={value === null}
        onClick={() => onChange(null)}
        className={cn(
          CARD,
          'justify-center gap-2.5 border-dashed text-[13px] font-semibold',
          value === null
            ? 'border-primary bg-primary/10 text-foreground'
            : 'border-border text-muted-foreground',
        )}
      >
        <Ban aria-hidden className="size-5.5" />
        No presenter
      </button>
    </div>
  )
}
