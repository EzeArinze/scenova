/**
 * Marketing-site copy and links in one place.
 * Until sign-up is live, point `cta.href` at your waitlist form and change
 * `cta.label` to "Join the waitlist".
 */
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
