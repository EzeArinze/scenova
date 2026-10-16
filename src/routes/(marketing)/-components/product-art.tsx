import { cn } from 'cn'
import { useId } from 'react'

export type Tone = {
  name: string
  bgFrom: string
  bgTo: string
  glass: string
  glassDeep: string
}

// Ordered so version 3 (the page's starting version) lands on peach.
export const TONES: Tone[] = [
  {
    name: 'lilac',
    bgFrom: 'oklch(95% 0.035 295)',
    bgTo: 'oklch(84% 0.1 285)',
    glass: 'oklch(74% 0.14 292)',
    glassDeep: 'oklch(58% 0.19 288)',
  },
  {
    name: 'sky',
    bgFrom: 'oklch(95.5% 0.03 235)',
    bgTo: 'oklch(85% 0.08 240)',
    glass: 'oklch(76% 0.11 240)',
    glassDeep: 'oklch(58% 0.14 245)',
  },
  {
    name: 'peach',
    bgFrom: 'oklch(96% 0.035 80)',
    bgTo: 'oklch(86% 0.09 40)',
    glass: 'oklch(80% 0.12 55)',
    glassDeep: 'oklch(63% 0.15 45)',
  },
  {
    name: 'mint',
    bgFrom: 'oklch(96% 0.035 170)',
    bgTo: 'oklch(86% 0.08 175)',
    glass: 'oklch(78% 0.11 170)',
    glassDeep: 'oklch(58% 0.12 170)',
  },
]

/** Version numbers start at 1. */
export function toneFor(version: number): Tone {
  const index = (((version - 1) % TONES.length) + TONES.length) % TONES.length
  return TONES[index]
}

export function backdrop(tone: Tone): string {
  return `linear-gradient(165deg, ${tone.bgFrom}, ${tone.bgTo})`
}

/** A dropper bottle. */
export function BottleArt({
  tone,
  className,
}: {
  tone: Tone
  className?: string
}) {
  const id = useId()
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tone.glass} />
          <stop offset="1" stopColor={tone.glassDeep} />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(32% 0.04 266)" />
          <stop offset="1" stopColor="oklch(18% 0.035 266)" />
        </linearGradient>
      </defs>
      <ellipse
        cx="100"
        cy="238"
        rx="64"
        ry="9"
        fill="oklch(20.8% 0.04 265.8 / 0.16)"
      />
      <rect
        x="58"
        y="104"
        width="84"
        height="132"
        rx="22"
        fill={`url(#${id}-glass)`}
      />
      <rect x="86" y="84" width="28" height="26" rx="6" fill={tone.glassDeep} />
      <rect
        x="78"
        y="44"
        width="44"
        height="44"
        rx="10"
        fill={`url(#${id}-cap)`}
      />
      <rect
        x="94"
        y="24"
        width="12"
        height="24"
        rx="5"
        fill={`url(#${id}-cap)`}
      />
      <rect
        x="72"
        y="146"
        width="56"
        height="54"
        rx="8"
        fill="white"
        fillOpacity="0.92"
      />
      <rect
        x="80"
        y="157"
        width="26"
        height="5"
        rx="2.5"
        fill={tone.glassDeep}
      />
      <rect
        x="80"
        y="168"
        width="40"
        height="3"
        rx="1.5"
        fill="oklch(20.8% 0.04 265.8 / 0.25)"
      />
      <rect
        x="80"
        y="176"
        width="32"
        height="3"
        rx="1.5"
        fill="oklch(20.8% 0.04 265.8 / 0.18)"
      />
      <rect
        x="66"
        y="124"
        width="5"
        height="62"
        rx="2.5"
        fill="white"
        fillOpacity="0.35"
      />
    </svg>
  )
}

export type SceneVariant = 'hero' | 'hook' | 'detail' | 'cta'

/** Tiny stand-in for a generated scene. */
export function SceneArt({
  tone,
  variant,
  className,
}: {
  tone: Tone
  variant: SceneVariant
  className?: string
}) {
  return (
    <div
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ background: backdrop(tone) }}
    >
      <div
        className="absolute -right-1/4 top-0 h-full w-2/3 -skew-x-12 opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, oklch(100% 0 0 / 0.6), transparent)',
        }}
      />
      {variant === 'hero' && (
        <BottleArt
          tone={tone}
          className="absolute bottom-[10%] left-1/2 w-[78%] -translate-x-1/2"
        />
      )}
      {variant === 'hook' && (
        <BottleArt
          tone={tone}
          className="absolute -bottom-[8%] left-1/2 w-[120%] -translate-x-1/2"
        />
      )}
      {variant === 'detail' && (
        <BottleArt
          tone={tone}
          className="absolute bottom-[8%] left-[6%] w-[64%]"
        />
      )}
      {variant === 'cta' && (
        <>
          <BottleArt
            tone={tone}
            className="absolute left-1/2 top-[8%] w-[58%] -translate-x-1/2"
          />
          <div className="absolute inset-x-[14%] bottom-[12%] h-[9%] rounded-full bg-white/90" />
        </>
      )}
    </div>
  )
}
