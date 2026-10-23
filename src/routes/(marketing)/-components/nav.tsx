import { Logo } from './logo'
import { siteConfig } from '#/utils/site-config'
import { cn } from 'cn'
import { buttonVariants } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { UserDropdown } from '#/components/user-dropdown'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Skeleton } from '#/components/ui/skeleton'
import { useAuthSession } from '#/hooks/use-auth-session'

export function Nav() {
  const { isAuthenticated, isPending, user, avatarUrl, initials } =
    useAuthSession()

  return (
    <header className="fixed inset-x-0 top-3 z-50 animate-drop-in px-3 sm:px-4">
      <nav
        aria-label="Main navigation"
        className={cn(
          'relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-xl px-3 sm:px-4',
          'border border-border/70 bg-card/85 shadow-card backdrop-blur-xl backdrop-saturate-150',
          'supports-backdrop-filter:bg-card/75',
          'motion-reduce:animate-none',
        )}
      >
        {/* Brand */}
        <Link
          to="/"
          aria-label="Scenova home"
          className="shrink-0 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-small font-medium text-muted-foreground',
                  'transition-colors duration-200',
                  'hover:bg-muted/70 hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {isPending ? (
            <Skeleton className="size-9 rounded-full" />
          ) : isAuthenticated && user ? (
            <UserDropdown
              align="center"
              trigger={
                <div
                  aria-label="Open account menu"
                  className="rounded-full outline-none transition-transform duration-200 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={avatarUrl} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
              }
              session={{ user, initials, avatarUrl }}
            />
          ) : (
            <Link
              to="/signin"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'lg',
                  className: 'hidden sm:inline-flex',
                }),
              )}
            >
              {siteConfig.login.label}
            </Link>
          )}

          <Link
            to="/dashboard"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'hidden sm:inline-flex h-10 rounded-lg px-3.5 text-sm font-semibold shadow-sm',
              'transition-[transform,box-shadow] duration-200',
              'hover:shadow-md active:scale-[0.98]',
            )}
          >
            {siteConfig.cta.label}
          </Link>

          {/* Native mobile menu: no React state or effects */}
          <details className="group relative md:hidden">
            <summary
              aria-label="Toggle navigation menu"
              className={cn(
                'grid size-10 cursor-pointer list-none place-items-center rounded-lg',
                'transition-colors duration-200 hover:bg-muted',
                'active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                '[&::-webkit-details-marker]:hidden',
              )}
            >
              <span className="relative block size-5" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current',
                    'transition-[transform,top] duration-200 ease-out',
                    'group-open:top-2.25 group-open:rotate-45',
                    'motion-reduce:transition-none',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-3.25] h-0.5 w-5 rounded-full bg-current',
                    'transition-[transform,top] duration-200 ease-out',
                    'group-open:top-2.25 group-open:-rotate-45',
                    'motion-reduce:transition-none',
                  )}
                />
              </span>
            </summary>

            <div
              className={cn(
                'absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-1.5rem))]',
                'origin-top-right rounded-2xl border border-border/70 bg-card p-2',
                'shadow-float',
                'animate-in fade-in-0 zoom-in-95 duration-150',
                'motion-reduce:animate-none',
              )}
            >
              <ul className="space-y-1">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.currentTarget
                          .closest('details')
                          ?.removeAttribute('open')
                      }}
                      className={cn(
                        'flex min-h-11 items-center rounded-xl px-3.5 py-2.5',
                        'text-sm font-medium text-muted-foreground',
                        'transition-colors duration-150',
                        'hover:bg-muted hover:text-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              {!isPending && !isAuthenticated && (
                <div className="mt-2 border-t border-border pt-2 sm:hidden">
                  <Link
                    to="/signin"
                    onClick={(event) => {
                      event.currentTarget
                        .closest('details')
                        ?.removeAttribute('open')
                    }}
                    className={cn(
                      buttonVariants({
                        variant: 'secondary',
                        size: 'lg',
                      }),
                      'w-full rounded-xl',
                    )}
                  >
                    {siteConfig.login.label}
                  </Link>
                </div>
              )}
            </div>
          </details>
        </div>
      </nav>
    </header>
  )
}
