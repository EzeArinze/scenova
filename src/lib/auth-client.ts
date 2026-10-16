import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  fetchOptions: {
    onError: async (context) => {
      const { response } = context
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-Retry-After')
        toast.warning(`Rate limit exceeded. Retry after ${retryAfter} seconds`)
      }
    },
  },
  sessionOptions: { refetchOnWindowFocus: false },
})

export const { signIn, signUp, useSession, getSession, signOut } = authClient
