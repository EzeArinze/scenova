import { Link } from '@tanstack/react-router'
import { ArrowLeft, Compass, Home } from 'lucide-react'
import { LogoMark } from '#/components/logo-mark'
import { buttonVariants } from '#/components/ui/button'

export function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <section
        aria-labelledby="not-found-title"
        className="relative w-full max-w-lg text-center"
      >
        <Link
          to="/"
          aria-label="Scenova home"
          className="mx-auto mb-12 flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/70 py-2 pr-4 pl-2 text-sm font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <LogoMark className="size-7" />
          Scenova
        </Link>

        <div className="relative mx-auto mb-7 flex size-24 items-center justify-center rounded-4xl border border-border/70 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Compass aria-hidden="true" className="size-7" />
          </div>
        </div>

        <p className="mb-2 text-sm font-semibold tracking-[0.24em] text-primary uppercase">
          Lost in the edit?
        </p>
        <p
          aria-hidden="true"
          className="text-7xl leading-none font-semibold tracking-[-0.08em] text-foreground/10 sm:text-8xl"
        >
          404
        </p>
        <h1
          id="not-found-title"
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          This page is off the map
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          The link may be out of date, or the page may have moved. Let’s get you
          back to something good.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className={buttonVariants({ size: 'lg' })}>
            <Home aria-hidden="true" className="size-4" />
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Go back
          </button>
        </div>
      </section>
    </main>
  )
}
