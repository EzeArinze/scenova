import { linkOptions } from '@tanstack/react-router'

export const siteConfig = {
  name: 'Scenova',
  cta: linkOptions({ label: 'Get started free', to: '/dashboard' }),
  demo: linkOptions({ label: 'Watch demo', to: '/' }),
  login: linkOptions({ label: 'Log in', to: '/signin' }),
  nav: linkOptions([
    { id: 'product', label: 'Product', to: '/', hash: 'product' },
    {
      id: 'how-it-works',
      label: 'How it works',
      to: '/',
      hash: 'how-it-works',
    },
    { id: 'pricing', label: 'Pricing', to: '/', hash: 'pricing' },
  ]),
} as const

export const MEDIA = {
  video:
    'https://res.cloudinary.com/t44uxef1/video/upload/v1793115106/9698793-uhd_2560_1440_25fps.mp4',
  poster:
    'https://res.cloudinary.com/t44uxef1/video/upload/w_1920,q_auto,f_auto/v1793115106/9698793-uhd_2560_1440_25fps.jpg',
} as const
