import { Button } from '#/components/ui/button'
import { siteConfig } from '#/utils/site-config'
// import { Button } from './button'
import { HeroStage } from './hero-stage/hero-stage'

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path d="M4.5 2.8v10.4L13 8Z" fill="currentColor" />
    </svg>
  )
}

/** Each frame is drawn at its real aspect ratio. */
const FORMATS = [
  { ratio: '9:16', note: 'Reels and Shorts', w: 11.25, h: 20 },
  { ratio: '1:1', note: 'Feed posts', w: 16, h: 16 },
  { ratio: '16:9', note: 'Web and YouTube', w: 20, h: 11.25 },
] as const

function FormatList() {
  return (
    <ul className="grid max-w-md grid-cols-3 gap-4 border-t border-border pt-5">
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

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-x-clip pb-16 pt-28 sm:pt-32 lg:pb-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="text-hero max-sm:text-[clamp(1.75rem,calc(10.4vw-4px),2.5rem)] max-sm:leading-[1.1] lg:text-[clamp(2.5rem,4.6vw,3.5rem)] lg:leading-[1.08]"
          >
            <span className="block animate-line-in [animation-delay:80ms]">
              Turn product photos
            </span>
            <span className="block animate-line-in [animation-delay:150ms]">
              into ads that move.
            </span>
          </h1>

          <p className="mt-5 max-w-136 animate-rise-in text-lg leading-7 text-muted-foreground [animation-delay:240ms]">
            Upload your product photos and pick a style. Scenova drafts the
            storyboard, you fix any scene, and it renders the finished ad.
          </p>

          <div className="mt-8 flex animate-rise-in flex-wrap items-center gap-3 [animation-delay:300ms]">
            <Button size="lg" className={'text-center'}>
              {siteConfig.cta.label}
            </Button>
            <Button size="lg" variant="secondary">
              <PlayIcon />
              {siteConfig.demo.label}
            </Button>
          </div>

          <div className="mt-10 animate-rise-in [animation-delay:380ms]">
            <FormatList />
          </div>
        </div>

        <HeroStage />
      </div>
    </section>
  )
}
