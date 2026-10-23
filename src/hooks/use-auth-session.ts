import { authClient } from '#/lib/auth-client'

export function useAuthSession() {
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user ?? null

  return {
    user,
    isAuthenticated: !!user,
    email: user?.email ?? null,
    initials: user?.name ? user.name.slice(0, 2).toUpperCase() : 'NB',
    avatarUrl: user?.image ?? `https://avatar.vercel.sh/${user?.name}`,
    isPending,
  }
}

export type User = NonNullable<ReturnType<typeof useAuthSession>['user']>
