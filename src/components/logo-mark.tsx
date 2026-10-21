import { cn } from 'cn'
import { useId } from 'react'

export function LogoMark({ className }: { className?: string }) {
  const id = useId()
  const gradientId = `${id}-logo-gradient`
  const clipId = `${id}-logo-clip`

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('size-8 shrink-0', className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="5"
          y1="1"
          x2="27"
          y2="31"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="oklch(76% 0.16 289)" />
          <stop offset="0.48" stopColor="oklch(63% 0.23 285)" />
          <stop offset="1" stopColor="oklch(54% 0.25 280)" />
        </linearGradient>

        <clipPath id={clipId}>
          <rect x="1" y="1" width="30" height="30" rx="8.5" />
        </clipPath>
      </defs>

      {/* Purple rounded-square background */}
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8.5"
        fill={`url(#${gradientId})`}
      />

      {/* Subtle glossy lighting */}
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M1 11.5V9.5C1 4.8 4.8 1 9.5 1H22.5C27.2 1 31 4.8 31 9.5V11.5H1Z"
          fill="white"
          fillOpacity=".2"
        />
        <path d="M1 15H4.8V31H1Z" fill="white" fillOpacity=".08" />
        <path d="M24.8 1H31V11.5H24.8Z" fill="white" fillOpacity=".08" />
        <path d="M22.5 26.5H25.3V31H22.5Z" fill="white" fillOpacity=".1" />
      </g>

      {/* Angular white monogram */}
      <path
        d="
          M13.9 7.1
          H9.1
          C7.1 7.1 5.9 8.5 5.9 10.5
          V21.3
          C5.9 23.5 7.2 24.8 9.4 24.8
          H18.2
          C19.2 24.8 19.5 23.9 18.7 23.2
          L15.1 20.4
          V10.1
          C15.1 8.3 14.8 7.1 13.9 7.1
          Z
        "
        fill="white"
      />

      {/* Upper diagonal cutout */}
      <path
        d="
          M17 7.5
          H22.9
          C23.5 7.5 23.6 8.1 23.1 8.6
          L17 13.2
          Z
        "
        fill="white"
      />

      {/* Bold angular right-hand shape */}
      <path
        d="
          M25.1 8.7
          L17.2 15.1
          C16.5 15.7 16.5 16.3 17.2 16.9
          L24.1 23.2
          C24.7 23.7 25.3 23.3 25.3 22.5
          V9.4
          C25.3 8.8 25.2 8.6 25.1 8.7
          Z
        "
        fill="white"
      />
    </svg>
  )
}
