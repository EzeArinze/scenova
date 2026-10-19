import { useEffect, useId, useRef, useState } from 'react'
import { Logo } from './logo'
import { siteConfig } from '#/utils/site-config'
import { cn } from 'cn'
import { Button, buttonVariants } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'

export function Nav() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const navRef = useRef<HTMLElement>(null)

  // Close on Escape, on outside press, and when the viewport grows past mobile.
  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (desktop.matches) setOpen(false)
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onChange)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-3 z-50 animate-drop-in px-3 sm:px-4">
      <nav
        ref={navRef}
        aria-label="Main"
        className={cn(
          'relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-lg pl-4 pr-2',
          'bg-card/75 shadow-card ring-1 ring-ink-900/5 backdrop-blur-xl backdrop-saturate-150',
          '[@media(prefers-reduced-transparency:reduce)]:bg-card [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
        )}
      >
        <Link to="/" aria-label="Scenova home" className="rounded-lg">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-md px-3.5 py-2 text-small text-muted-foreground transition-colors duration-(--duration-fast) hover-fine:bg-muted hover-fine:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Link
            to="/signin"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'lg',
                className: 'max-sm:hidden',
              }),
            )}
          >
            {siteConfig.login.label}
          </Link>
          <Link to="/dashboard" className={cn(buttonVariants({ size: 'lg' }))}>
            {siteConfig.cta.label}
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-pill transition-[transform,background-color] duration-(--duration-fast) ease-out active:scale-[0.95] hover-fine:bg-muted md:hidden"
          >
            <span className="relative block size-5" aria-hidden="true">
              <span
                className={cn(
                  'absolute left-0 top-1.75 h-0.5 w-5 rounded-full bg-current transition-transform duration-(--duration-base) ease-out',
                  open && 'translate-y-0.5 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-2.75 h-0.5 w-5 rounded-full bg-current transition-transform duration-(--duration-base) ease-out',
                  open && '-translate-y-0.5 -rotate-45',
                )}
              />
            </span>
          </button>
        </div>

        <div
          id={panelId}
          className={cn(
            'absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top-right rounded-2xl bg-card p-2 shadow-float ring-1 ring-ink-900/5 md:hidden',
            'transition-[opacity,transform,visibility] ease-out',
            open
              ? 'visible scale-100 opacity-100 duration-(--duration-base)'
              : 'invisible scale-[0.97] opacity-0 duration-(--duration-fast)',
          )}
        >
          <ul>
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-body font-medium transition-colors duration-(--duration-fast) hover-fine:bg-muted"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-border p-2 pt-3 sm:hidden">
            <Button
              // href={siteConfig.login.href}
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {siteConfig.login.label}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
