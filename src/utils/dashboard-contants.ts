import { linkOptions } from '@tanstack/react-router'
import {
  Clapperboard,
  Film,
  Images,
  LayoutDashboard,
  LayoutTemplate,
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
      { to: '/', label: 'New video', icon: Clapperboard },
      { to: '/', label: 'Projects', icon: Film },
    ]),
  },
  {
    label: 'Library',
    items: linkOptions([
      { to: '/', label: 'Templates', icon: LayoutTemplate },
      { to: '/', label: 'Creators', icon: UserRound },
      { to: '/', label: 'Assets', icon: Images },
    ]),
  },
]
