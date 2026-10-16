import { useEffect, useRef, useState } from 'react'

import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import type { MotionValue } from 'motion/react'
import { SceneArt, TONES, toneFor } from './product-art'
import type { SceneVariant, Tone } from './product-art'
import { cn } from 'cn'
import { Button } from '#/components/ui/button'

const FIRST_VERSION = 3
const REGENERATE_MS = 1100
const PARALLAX_RANGE = 1 // multiplied by each layer's depth, in px
const SPRING = { stiffness: 120, damping: 20, mass: 0.4 }

/* -------------------------------------------------------------------------
   Crossfade: swaps scene art with a short fade + 2px blur, which hides the
   two-state overlap better than opacity alone.
   ------------------------------------------------------------------------- */
function Crossfade({
  tone,
  className,
  children,
}: {
  tone: Tone
  className?: string
  children: (tone: Tone) => ReactNode
}) {
  const [slots, setSlots] = useState<[Tone, Tone]>([tone, tone])
  const [active, setActive] = useState<0 | 1>(0)

  useEffect(() => {
    if (slots[active].name === tone.name) return
    const next: 0 | 1 = active === 0 ? 1 : 0
    setSlots((current) => {
      const copy: [Tone, Tone] = [current[0], current[1]]
      copy[next] = tone
      return copy
    })
    setActive(next)
  }, [tone, slots, active])

  return (
    <div className={className}>
      {([0, 1] as const).map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-[opacity,filter] duration-(--duration-slow) ease-out',
            active === index ? 'opacity-100 blur-0' : 'opacity-0 blur-[2px]',
          )}
        >
          {children(slots[index])}
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------
   Layout helpers. Three nested elements keep three kinds of motion apart:
   outer = position + entrance animation, middle = static tilt,
   inner = cursor parallax. Each owns a different `transform`.
   ------------------------------------------------------------------------- */
function Parallax({
  depth,
  x,
  y,
  children,
}: {
  depth: number
  x: MotionValue<number>
  y: MotionValue<number>
  children: ReactNode
}) {
  const tx = useTransform(x, (value) => value * depth)
  const ty = useTransform(y, (value) => value * depth)
  const transform = useMotionTemplate`translate3d(${tx}px, ${ty}px, 0)`
  return <motion.div style={{ transform }}>{children}</motion.div>
}

function Float({
  className,
  delay,
  depth,
  tilt = 0,
  entrance = 'animate-pop-in',
  x,
  y,
  children,
}: {
  className: string
  delay: number
  depth: number
  tilt?: number
  entrance?: 'animate-pop-in' | 'animate-rise-in'
  x: MotionValue<number>
  y: MotionValue<number>
  children: ReactNode
}) {
  return (
    <div
      className={cn('absolute [animation-delay:var(--d)]', entrance, className)}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      <div style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}>
        <Parallax depth={depth} x={x} y={y}>
          {children}
        </Parallax>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------
   Small pieces
   ------------------------------------------------------------------------- */
const cardSurface = 'bg-card shadow-raised ring-1 ring-ink-900/5'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.5 8a5.5 5.5 0 1 1-1.8-4.07M13.5 2.5v3h-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SCENES: Array<{
  label: string
  tone: Tone
  variant: SceneVariant
}> = [
  { label: 'Hook', tone: TONES[1], variant: 'hook' },
  { label: 'Benefits', tone: TONES[2], variant: 'detail' }, // replaced by live scene 2
  { label: 'Lifestyle', tone: TONES[3], variant: 'detail' },
  { label: 'CTA', tone: TONES[0], variant: 'cta' },
]

function VersionChips({ version }: { version: number }) {
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
            'animate-pop-in rounded-pill px-2 py-0.5 text-[0.6875rem] font-semibold leading-4',
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

/* -------------------------------------------------------------------------
   The stage
   ------------------------------------------------------------------------- */
export function HeroStage() {
  const reduceMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, SPRING)
  const springY = useSpring(pointerY, SPRING)

  const [version, setVersion] = useState(FIRST_VERSION)
  const [busy, setBusy] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  const tone = toneFor(version)

  function regenerate() {
    if (busy) return
    const next = version + 1
    setBusy(true)
    setAnnouncement('Generating scene 2.')
    timer.current = window.setTimeout(() => {
      setVersion(next)
      setBusy(false)
      setAnnouncement(`Scene 2 regenerated. Version ${next} is selected.`)
    }, REGENERATE_MS)
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    // Decorative depth for real mice only; never on touch or reduced motion.
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(
      ((event.clientX - rect.left) / rect.width - 0.5) * 2 * PARALLAX_RANGE,
    )
    pointerY.set(
      ((event.clientY - rect.top) / rect.height - 0.5) * 2 * PARALLAX_RANGE,
    )
  }

  function onPointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      role="group"
      aria-label="Interactive preview: regenerate one scene of an ad"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto aspect-[9/12] w-full max-w-[34rem] sm:aspect-[9/11]"
    >
      <div
        className="glow-violet pointer-events-none absolute -inset-[14%]"
        aria-hidden="true"
      />

      {/* Uploaded product photo */}
      <Float
        className="left-0 top-[14%] hidden w-[31%] sm:block"
        delay={520}
        depth={14}
        tilt={-6}
        x={springX}
        y={springY}
      >
        <div className={cn('rounded-xl p-2', cardSurface)} aria-hidden="true">
          <div
            className="relative aspect-square overflow-hidden rounded-lg"
            style={{ background: 'oklch(97% 0.004 265)' }}
          >
            <SceneArt tone={TONES[2]} variant="hero" className="!bg-none" />
          </div>
          <div className="mt-2 flex items-center gap-1.5 px-0.5 pb-0.5">
            <span className="grid size-4 place-items-center rounded-full bg-success text-ink-950">
              <CheckIcon className="size-3" />
            </span>
            <span className="text-label font-semibold">Your photo</span>
          </div>
        </div>
      </Float>

      {/* The video */}
      <Float
        className="left-[29%] top-0 w-[52%] sm:left-[30%]"
        delay={180}
        depth={6}
        tilt={2.5}
        entrance="animate-rise-in"
        x={springX}
        y={springY}
      >
        <div className="aspect-[9/16] rounded-[1.75rem] bg-ink-900 p-[5px] shadow-float">
          <div className="relative h-full overflow-hidden rounded-[1.4rem]">
            <Crossfade tone={tone} className="absolute inset-0">
              {(t) => <SceneArt tone={t} variant="hero" />}
            </Crossfade>

            {/* Busy shimmer */}
            <div
              className={cn(
                'pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-(--duration-base)',
                busy ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden="true"
            >
              <div
                className={cn(
                  'h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent',
                  busy && 'animate-shimmer',
                )}
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-900/35 to-transparent" />

            {/* Story-style progress: one segment per scene, scene 2 playing */}
            <div
              className="absolute inset-x-3.5 top-3 flex gap-1"
              aria-hidden="true"
            >
              {[100, 45, 0, 0].map((fill, index) => (
                <span
                  key={index}
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/40"
                >
                  <span
                    className="block h-full rounded-full bg-white"
                    style={{ width: `${fill}%` }}
                  />
                </span>
              ))}
            </div>

            <span className="absolute left-3 top-7 rounded-pill bg-ink-900/70 px-2.5 py-1 text-[0.6875rem] font-semibold leading-4 text-white backdrop-blur-md">
              {busy ? 'Generating scene 2' : 'AI generated video'}
            </span>

            {/* Real text and CTA, composited over the clip */}
            <div className="absolute inset-x-3.5 bottom-[4.5rem] text-white">
              <p className="text-[1.25rem] font-bold leading-6 tracking-[-0.02em]">
                Glow, daily.
              </p>
              <span className="mt-2 inline-block rounded-pill bg-white px-3 py-1 text-[0.6875rem] font-semibold leading-4 text-ink-900">
                Shop now
              </span>
            </div>
          </div>
        </div>
      </Float>

      {/* Storyboard strip with the one interaction */}
      <Float
        className="bottom-[1%] left-[2%] w-[64%] sm:left-[4%]"
        delay={640}
        depth={10}
        x={springX}
        y={springY}
      >
        <div className={cn('rounded-2xl p-3', cardSurface)}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-label font-semibold">Scene 2 of 4</p>
            <VersionChips version={version} />
          </div>

          <ol
            className="mt-2.5 grid grid-cols-4 gap-1.5"
            aria-label="Storyboard"
          >
            {SCENES.map((scene, index) => {
              const selected = index === 1
              return (
                <li key={scene.label}>
                  <div
                    className={cn(
                      'relative aspect-[4/5] overflow-hidden rounded-md',
                      selected &&
                        'ring-2 ring-primary ring-offset-2 ring-offset-card',
                    )}
                  >
                    {selected ? (
                      <Crossfade tone={tone} className="absolute inset-0">
                        {(t) => <SceneArt tone={t} variant="detail" />}
                      </Crossfade>
                    ) : (
                      <SceneArt tone={scene.tone} variant={scene.variant} />
                    )}
                  </div>
                  <p
                    className={cn(
                      'mt-1 truncate text-[0.6875rem] leading-4',
                      selected
                        ? 'font-semibold text-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {scene.label}
                  </p>
                </li>
              )
            })}
          </ol>

          <div className="mt-2.5 flex items-center gap-2.5">
            <div className="relative">
              <Button
                size="sm"
                variant="secondary"
                onClick={regenerate}
                aria-disabled={busy}
                className={cn(busy && 'pointer-events-none opacity-70')}
              >
                <RefreshIcon
                  className={cn('size-3.5', busy && 'animate-spin')}
                />
                {busy ? 'Generating' : 'Regenerate'}
              </Button>
              {/* One-time ring that says "this is clickable" */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-nudge rounded-pill border-2 border-primary/50 [animation-delay:2200ms]"
              />
            </div>
            <p className="hidden text-label text-muted-foreground min-[420px]:block">
              Earlier versions stay saved.
            </p>
          </div>
        </div>
      </Float>

      {/* Export status */}
      <Float
        className="right-0 top-[19%] w-max"
        delay={760}
        depth={18}
        x={springX}
        y={springY}
      >
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-2xl px-3 py-2.5',
            cardSurface,
          )}
          aria-hidden="true"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-success-soft text-success-soft-foreground">
            <CheckIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="whitespace-nowrap text-label font-semibold leading-4">
              Export ready
            </p>
            <p className="text-[0.6875rem] leading-4 text-muted-foreground">
              MP4 at 9:16
            </p>
          </div>
        </div>
      </Float>

      {/* Tagline from the brand board */}
      <Float
        className="bottom-[8%] right-0 hidden w-[27%] sm:block"
        delay={880}
        depth={12}
        x={springX}
        y={springY}
      >
        <p
          className={cn(
            'rounded-2xl px-3.5 py-3 text-small font-semibold leading-snug',
            cardSurface,
          )}
          aria-hidden="true"
        >
          From photo to video ad in minutes.
        </p>
      </Float>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
