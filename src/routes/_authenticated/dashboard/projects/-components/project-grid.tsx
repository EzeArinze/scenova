import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { rise } from '#/utils/dashboard-contants'

/** Main column plus a side panel. Stacks on small screens. */
export function ProjectGrid({
  main,
  aside,
}: {
  main: ReactNode
  aside: ReactNode
}) {
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
      <div className="min-w-0 space-y-7.5">{main}</div>
      <aside className="space-y-4">{aside}</aside>
    </div>
  )
}

export function PageHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <motion.div variants={rise}>
      <h2 className="font-serif text-4xl leading-tight font-medium tracking-tight text-balance">
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
        {subtitle}
      </p>
    </motion.div>
  )
}
