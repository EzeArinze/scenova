export const siteConfig = {
  name: 'Scenova',
  cta: { label: 'Get started free', href: '#get-started' },
  demo: { label: 'Watch demo', href: '#demo' },
  login: { label: 'Log in', href: '/signin' },
  nav: [
    { label: 'Product', href: '#product' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
} as const

export const MEDIA = {
  video:
    'https://res.cloudinary.com/t44uxef1/video/upload/v1793115106/9698793-uhd_2560_1440_25fps.mp4',
  poster:
    'https://images.pexels.com/videos/9698793/pexels-photo-9698793.jpeg?auto=compress&w=1260&h=750&dpr=1',
} as const
