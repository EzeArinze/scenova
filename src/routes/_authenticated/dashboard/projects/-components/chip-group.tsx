import { useId } from 'react'
import { Check } from 'lucide-react'
import { cn } from 'cn'

type Option<T extends string> = { value: T; label: string }

/** Single-select chips. Selecting the active chip again clears it. */
export function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T | null
  options: Option<T>[]
  onChange: (value: T | null) => void
}) {
  const labelId = useId()
  return (
    <div role="group" aria-labelledby={labelId} className="space-y-2.5">
      <div id={labelId} className="text-sm font-semibold">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : option.value)}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full border px-[18px] text-sm font-semibold transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]',
                selected
                  ? 'border-primary bg-primary/15 text-foreground'
                  : 'border-border text-foreground',
              )}
            >
              {selected && <Check aria-hidden className="size-3.5" />}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
