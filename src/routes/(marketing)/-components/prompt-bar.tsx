import { buttonVariants } from '#/components/ui/button'
import { MEDIA, siteConfig } from '#/utils/site-config'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { AnimatePresence, useReducedMotion, motion } from 'motion/react'
import { useEffect, useState } from 'react'

const PROMPTS = [
  'Glass serum bottle on wet marble, soft morning light, slow push-in',
  'Hand lifts the jar, turns it to camera, warm studio glow',
  'Sneaker lands on a neon-lit street, quick cuts, bold captions',
]

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export function PromptBar() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(
      () => setIndex((n) => (n + 1) % PROMPTS.length),
      3800,
    )
    return () => window.clearInterval(id)
  }, [reduceMotion])

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-white/25 bg-black/35 p-1.5 backdrop-blur-xl">
      {/* The product photo the brief is about */}
      <span
        aria-hidden="true"
        className="hidden h-10 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25 min-[420px]:block"
      >
        <img
          src={MEDIA.poster}
          alt=""
          className="size-full object-cover"
          loading="eager"
          decoding="async"
        />
      </span>
      <span
        aria-hidden="true"
        className="hidden h-5 w-px shrink-0 bg-white/30 min-[420px]:block"
      />

      <div className="relative h-5 min-w-0 flex-1 overflow-hidden pl-3 min-[420px]:pl-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={{
              opacity: 0,
              transform: 'translateY(6px)',
              filter: 'blur(4px)',
            }}
            animate={{
              opacity: 1,
              transform: 'translateY(0px)',
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              transform: 'translateY(-6px)',
              filter: 'blur(4px)',
            }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="absolute inset-0 truncate text-sm leading-5 text-white/90"
          >
            {PROMPTS[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <Link
        to="/signup"
        className={cn(
          buttonVariants({ size: 'lg' }),
          'shrink-0 rounded-full text-center',
        )}
      >
        {siteConfig.cta.label}
      </Link>
    </div>
  )
}
