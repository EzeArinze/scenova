import { motion, useMotionTemplate, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

export function Parallax({
  depth,
  x,
  y,
  children,
}: {
  depth: number
  x: MotionValue<number>
  y: MotionValue<number>
  children: ReactNode
}) {
  const tx = useTransform(x, (value) => value * depth)
  const ty = useTransform(y, (value) => value * depth)
  const transform = useMotionTemplate`translate3d(${tx}px, ${ty}px, 0)`
  return <motion.div style={{ transform }}>{children}</motion.div>
}
