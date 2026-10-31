import { motion } from 'motion/react'
import { StartCards } from './start-cards'
import type { StartAction } from './start-cards'
import { rise } from '#/utils/dashboard-contants'

export function HomeEmpty({
  firstName,
  onPick,
}: {
  firstName?: string
  onPick: (action: StartAction) => void
}) {
  return (
    <section
      aria-labelledby="home-greeting"
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center pt-[clamp(2rem,11vh,6rem)]"
    >
      <motion.h1
        id="home-greeting"
        variants={rise}
        className="text-center font-serif text-4xl font-medium tracking-tight text-balance md:text-5xl"
      >
        Hi {firstName ?? 'there'}
      </motion.h1>
      <motion.p
        variants={rise}
        className="mt-2 text-center text-lg text-balance text-muted-foreground"
      >
        What ad do you want to make today?
      </motion.p>
      <StartCards className="mt-10" onPick={onPick} />
    </section>
  )
}
