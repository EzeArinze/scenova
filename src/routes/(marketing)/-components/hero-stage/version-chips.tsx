import { cn } from 'cn'

export function VersionChips({ version }: { version: number }) {
  const shown = [version - 2, version - 1, version].filter(
    (value) => value >= 1,
  )
  return (
    <ul
      className="flex items-center gap-1"
      aria-label="Saved versions of scene 2"
    >
      {shown.map((value) => (
        <li
          key={value}
          aria-current={value === version ? 'true' : undefined}
          className={cn(
            'animate-pop-in rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold leading-4',
            value === version
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          )}
        >
          v{value}
        </li>
      ))}
    </ul>
  )
}
