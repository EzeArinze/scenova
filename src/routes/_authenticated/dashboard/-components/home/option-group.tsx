import { cn } from 'cn'
import { EASE } from './constant'

export function OptionGroup<T extends string | number>({
  label,
  value,
  options,
  format,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  format: (value: T) => string
  onChange: (value: T) => void
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-muted/50 p-1"
      >
        {options.map((option) => {
          const selected = option === value
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={cn(
                'h-8 rounded-lg text-xs font-medium transition-[scale] duration-150 active:scale-[0.97]',
                EASE,
                selected
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              {format(option)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
