import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { SceneArt, TONES, toneFor } from '../product-art'
import { cn } from 'cn'
import { Button } from '#/components/ui/button'
import {
  cardSurface,
  FIRST_VERSION,
  PARALLAX_RANGE,
  REGENERATE_MS,
  SCENES,
  SPRING,
} from './constants'
import { Float } from './float'
import { CheckIcon, RefreshIcon } from './icons'
import { Crossfade } from './crossfade'
import { VersionChips } from './version-chips'

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
      className="relative mx-auto aspect-9/12 w-full max-w-136 sm:aspect-9/11"
    >
      <div
        className="glow-violet pointer-events-none absolute inset-[-14%]"
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
            <SceneArt tone={TONES[2]} variant="hero" className="bg-none!" />
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
        <div className="aspect-9/16 rounded-[1.75rem] bg-ink-900 p-1.25 shadow-float">
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
                  'h-full w-full bg-linear-to-r from-transparent via-white/50 to-transparent',
                  busy && 'animate-shimmer',
                )}
              />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink-900/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-ink-900/35 to-transparent" />

            {/* Story-style progress: one segment per scene, scene 2 playing */}
            <div
              className="absolute inset-x-3.5 top-3 flex gap-1"
              aria-hidden="true"
            >
              {[100, 45, 0, 0].map((fill, index) => (
                <span
                  key={index}
                  className="h-0.75 flex-1 overflow-hidden rounded-full bg-white/40"
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
            <div className="absolute inset-x-3.5 bottom-18  text-white">
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
        <div className={cn('rounded-lg p-3', cardSurface)}>
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
                      'relative aspect-4/5 overflow-hidden rounded-md',
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
            <div className="relative border-none">
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
                className="pointer-events-none absolute inset-0 animate-nudge rounded-md border-2 border-primary/50 [animation-delay:2200ms]"
              />
            </div>
            <p className="hidden text-sm text-muted-foreground min-[420px]:block">
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
            'flex items-center gap-2.5 rounded-lg px-3 py-2.5',
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
