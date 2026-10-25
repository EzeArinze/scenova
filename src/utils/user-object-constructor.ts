import type { User } from '#/hooks/use-auth-session'

export function userObjectConstructor({ user }: { user: User }) {
  return {
    user,
    email: user.email,
    name: user.name,
    initials: user.name.slice(0, 2).toUpperCase() || 'NB',
    avatarUrl: user.image ?? `https://avatar.vercel.sh/${user.name}`,
  }
}
