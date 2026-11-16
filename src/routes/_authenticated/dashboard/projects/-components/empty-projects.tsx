import { motion } from 'motion/react'
import { rise } from '#/utils/dashboard-contants'
import { buttonVariants } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'

export function ProjectEmpty() {
  return (
    <section
      aria-labelledby="project-greeting"
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center pt-[clamp(2rem,11vh,6rem)]"
    >
      <motion.h1
        id="project-greeting"
        variants={rise}
        className="text-center font-serif text-4xl font-medium tracking-tight text-balance md:text-5xl"
      >
        Hi 'there'
      </motion.h1>
      <motion.p
        variants={rise}
        className="mt-2 text-center text-lg text-balance text-muted-foreground"
      >
        Create a project to get started!
      </motion.p>
      {/* Create Project Button */}
      <motion.div
        variants={rise}
        className="mt-6 flex items-center justify-center gap-4"
      >
        <Link to="/dashboard" className={buttonVariants({})}>
          Create Project
        </Link>
      </motion.div>
    </section>
  )
}
