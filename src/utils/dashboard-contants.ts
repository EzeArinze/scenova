import { linkOptions } from '@tanstack/react-router'
import {
  Clapperboard,
  Film,
  Images,
  LayoutDashboard,
  UserRound,
} from 'lucide-react'

export const NAV = [
  {
    label: 'Create',
    items: linkOptions([
      {
        to: '/dashboard',
        label: 'Overview',
        icon: LayoutDashboard,
        activeOptions: { exact: true },
      },
      {
        to: '/dashboard/create-adds',
        label: 'Create adds',
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
