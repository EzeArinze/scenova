import { Search, X } from 'lucide-react'

type MediaSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function MediaSearch({ value, onChange }: MediaSearchProps) {
  return (
    <label className="flex h-10 w-full max-w-md items-center gap-2.5 rounded-full border border-border bg-card px-4 focus-within:border-foreground/25">
      <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects and media"
        aria-label="Search projects and media"
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="-mr-1.5 grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.94]"
        >
          <X aria-hidden className="size-3.5" />
        </button>
      )}
    </label>
  )
}
