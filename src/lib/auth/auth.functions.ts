import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '../auth'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

export const getAuthSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (session) {
      throw redirect({ to: '/' })
    }
  },
)

export const getAuthDashboardSessionFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })

  return session
})
