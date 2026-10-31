import type { User } from '#/hooks/use-auth-session'

export function userObjectConstructor({ user }: { user: User }) {
  return {
    user,
    email: user.email,
    name: user.name || user.email.split('@').at(0),
    firstName: user.name.trim().split(/\s+/)[0] || undefined,
    initials: user.name.slice(0, 2).toUpperCase() || 'NB',
    avatarUrl: user.image ?? `https://avatar.vercel.sh/${user.name}`,
  }
}
