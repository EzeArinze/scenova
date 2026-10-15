import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  fetchOptions: {},
  sessionOptions: { refetchOnWindowFocus: false },
})
