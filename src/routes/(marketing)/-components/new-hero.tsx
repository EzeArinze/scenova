import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { MEDIA, siteConfig } from '#/utils/site-config'
import { PromptBar } from './prompt-bar'
import { FormatList } from './format-list'

export function NewHero() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  // React does not reliably reflect `muted`, and autoplay needs it.
  // Moving background video also stays still for people who ask for less motion.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    if (reduceMotion) video.pause()
    else video.play().catch(() => {})
  }, [reduceMotion])

  function togglePlayback() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate mx-2 mt-2 flex min-h-[calc(100svh-1rem)] overflow-hidden rounded-xl border border-border bg-card sm:mx-3"
    >
      {/* Background video. The poster shows while it loads and when paused. */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 size-full object-cover"
        src={MEDIA.video}
        poster={MEDIA.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Scrims keep white text readable on any frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/20 to-black/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/45 via-transparent to-transparent"
      />

      <div className="mt-auto w-full px-5 pb-20 pt-36 sm:px-10 lg:px-16 lg:pb-14">
        <div className="max-w-3xl">
          <div className="space-y-2">
            <h1
              id="hero-title"
              className="text-[clamp(2.5rem,6.4vw,4.75rem)] font-semibold leading-[1.04] tracking-tight text-white"
            >
              <span className="block animate-line-in [animation-delay:80ms]">
                Turn product photos
              </span>
              <span className="block animate-line-in [animation-delay:150ms]">
                into ads that move.
              </span>
            </h1>

            <p className="mt-5 max-w-xl animate-rise-in text-lg leading-7 text-white/80 [animation-delay:240ms]">
              Upload your product photos and pick a style. Scenova drafts the
              storyboard, you fix any scene, and it renders the finished ad.
            </p>

            <FormatList />
          </div>

          <div className="mt-8 flex animate-rise-in flex-col gap-3 [animation-delay:320ms] sm:flex-row sm:items-center">
            <PromptBar />
            <Button
              size="lg"
              variant="secondary"
              className="shrink-0 justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-xl hover-fine:bg-white/20"
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M4.5 2.8v10.4L13 8Z" fill="currentColor" />
              </svg>
              {siteConfig.demo.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Anyone can stop background motion. */}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={
          playing ? 'Pause background video' : 'Play background video'
        }
        className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-xl transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95] hover-fine:bg-black/55 sm:bottom-6 sm:right-6"
      >
        {playing ? (
          <Pause aria-hidden className="size-4" />
        ) : (
          <Play aria-hidden className="size-4" />
        )}
      </button>
    </section>
  )
}
