import { cn } from 'cn'
import { useId } from 'react'

/** Scenova mark: a frame bar and a play head, on the brand violet. */
export function LogoMark({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8 shrink-0', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-g`}
          x1="4"
          y1="2"
          x2="28"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="oklch(66% 0.2 288)" />
          <stop offset="1" stopColor="oklch(54% 0.26 283)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${id}-g)`} />
      <rect x="8.5" y="8" width="4.5" height="16" rx="2.25" fill="white" />
      <path
        d="M16.6 9.6 23.6 16l-7 6.4Z"
        fill="white"
        stroke="white"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[1.25rem] font-bold leading-none tracking-[-0.03em]">
        Scenova
      </span>
    </span>
  )
}
