import { linkOptions } from '@tanstack/react-router'
import {
  Clapperboard,
  Film,
  Images,
  LayoutDashboard,
  UserRound,
} from 'lucide-react'
import type { Variants } from 'motion/react'

export const NAV = [
  {
    label: 'Create',
    items: linkOptions([
      {
        to: '/dashboard',
        label: 'Home / All Media',
        icon: LayoutDashboard,
        activeOptions: { exact: true },
      },
      {
        to: '/dashboard/create-ads',
        label: 'Create ads',
        icon: Clapperboard,
      },
      { to: '/dashboard/projects', label: 'Projects', icon: Film },
    ]),
  },
  {
    label: 'Library',
    items: linkOptions([
      { to: '/dashboard/avatar', label: 'Avatar', icon: UserRound },
      { to: '/dashboard/assets', label: 'Assets', icon: Images },
    ]),
  },
]

export const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } },
}

export const rise: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE_OUT } },
}
