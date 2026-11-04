import type { ErrorComponentProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, RefreshCw, TriangleAlert } from 'lucide-react'
import { Button, buttonVariants } from '#/components/ui/button'

export function GlobalError({ reset }: ErrorComponentProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-80 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <section
        aria-labelledby="global-error-title"
        className="relative w-full max-w-lg text-center"
      >
        <div className="relative mx-auto mb-8 flex size-24 items-center justify-center rounded-4xl border border-border/70 bg-card/80 shadow-xl shadow-primary/5 backdrop-blur">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <TriangleAlert aria-hidden="true" className="size-7" />
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
          A little detour
        </p>
        <h1
          id="global-error-title"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          We couldn’t load this page. Try again, or head back home and give it
          another go.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="h-10 gap-2 px-4">
            <RefreshCw aria-hidden="true" className="size-4" />
            Try again
          </Button>
          <Link
            to="/"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to home
          </Link>
        </div>
      </section>
    </main>
  )
}
