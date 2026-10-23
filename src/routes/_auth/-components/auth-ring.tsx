import { motion, useReducedMotion } from 'motion/react'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const ring =
  'absolute top-1/2 aspect-square w-[85vw] max-w-[1100px] -translate-y-1/2 rounded-full ' +
  'border-[14vw] border-foreground/[0.04] md:border-[9vw]'

// Two oversized rings bleeding off the left and right edges.
// Decorative only: place it first inside a `relative overflow-hidden` wrapper.
export function AuthRings() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.2 : 1.2, ease: EASE_OUT }}
      className="pointer-events-none absolute inset-0"
    >
      <div className={`${ring} left-0 -translate-x-1/2`} />
      <div className={`${ring} right-0 translate-x-1/2`} />
    </motion.div>
  )
}
