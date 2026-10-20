import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

const BRAND = 'scenova'

const CTA = {
  title: 'Make your first video ad today',
  body: 'Scenova turns your product and a short brief into UGC-style video ads, ready to run.',
  label: 'Start for free',
  href: '/signup',
}

const INTERNAL_LINKS = [
  { label: 'Product', href: '/' },
  { label: 'About us', href: '/' },
  { label: 'Pricing', href: '/' },
  { label: 'FAQ', href: '/' },
  { label: 'Contact', href: '/' },
]

const EXTERNAL_LINKS = [
  { label: 'X', href: 'https://x.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
]

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const linkClass =
  'inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground ' +
  'transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ' +
  'hover-fine:text-muted-foreground'

export function Footer() {
  const reduceMotion = useReducedMotion()

  return (
    // `dark` re-scopes the design tokens, so the footer stays dark in light mode too.
    <footer className="relative overflow-hidden bg-background text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 text-center">
        {/* CTA */}
        <h2 className="max-w-[18ch] text-4xl font-semibold tracking-tight sm:text-5xl">
          {CTA.title}
        </h2>
        <p className="mt-4 max-w-[44ch] text-base text-muted-foreground">
          {CTA.body}
        </p>
        <a
          href={CTA.href}
          className={
            'mt-8 inline-flex h-10 items-center justify-center rounded-md bg-foreground px-5 ' +
            'text-sm font-medium text-background ' +
            'transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ' +
            'active:scale-[0.97]'
          }
        >
          {CTA.label}
        </a>

        {/* Links */}
        <nav aria-label="Footer" className="mt-16">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {INTERNAL_LINKS.map((item) => (
              <li key={item.label}>
                <Link to={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            {EXTERNAL_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} group`}
                >
                  {item.label}
                  <ArrowUpRight
                    aria-hidden
                    className={
                      'size-3.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ' +
                      'group-hover-fine:translate-x-px group-hover-fine:-translate-y-px'
                    }
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to={'/'}
          className="mt-6 rounded-sm text-sm text-muted-foreground transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover-fine:text-foreground"
        >
          Privacy policy
        </Link>
      </div>

      {/* Wordmark: one orchestrated entrance, fading out into the page edge. */}
      <div className="mt-16 @container" aria-hidden>
        <div className="h-[17cqw] overflow-hidden">
          <motion.p
            initial={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    transform: 'translateY(14%)',
                    filter: 'blur(8px)',
                  }
            }
            whileInView={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    transform: 'translateY(0%)',
                    filter: 'blur(0px)',
                  }
            }
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: EASE_OUT }}
            className={
              'select-none whitespace-nowrap text-center text-[27cqw] font-medium leading-[0.85] ' +
              'tracking-tighter text-transparent bg-clip-text ' +
              'bg-linear-to-b from-foreground via-foreground/45 to-transparent'
            }
          >
            {BRAND}
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
