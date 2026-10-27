const FORMATS = [
  { ratio: '9:16', note: 'Reels and Shorts', w: 11.25, h: 20 },
  { ratio: '1:1', note: 'Feed posts', w: 16, h: 16 },
  { ratio: '16:9', note: 'Web and YouTube', w: 20, h: 11.25 },
] as const

export function FormatList() {
  return (
    <ul className="grid max-w-md grid-cols-3 gap-4 pt-5">
      {FORMATS.map((format) => (
        <li key={format.ratio} className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 22 22"
            className="size-5 shrink-0 text-ink-500"
            aria-hidden="true"
          >
            <rect
              x={(22 - format.w) / 2}
              y={(22 - format.h) / 2}
              width={format.w}
              height={format.h}
              rx="2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="min-w-0">
            <span className="block text-small font-semibold leading-5">
              {format.ratio}
            </span>
            <span className="block text-[0.6875rem] leading-4 text-muted-foreground">
              {format.note}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
