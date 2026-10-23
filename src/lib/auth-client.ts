import { toast } from '#/components/ui/toast'
import { createAuthClient } from 'better-auth/react'
import { magicLinkClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  fetchOptions: {
    onError: async (context) => {
      const { response } = context
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-Retry-After')
        toast.add({
          type: 'warning',
          description: `Rate limit exceeded. Retry after ${retryAfter} seconds`,
        })
      }
    },
  },
  sessionOptions: { refetchOnWindowFocus: false },
  plugins: [magicLinkClient()],
})

export const { signIn, signUp, useSession, getSession, signOut } = authClient
