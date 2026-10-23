import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '../auth'
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { magicLinkSchema } from '#/z-schemas/auth.schema'

export const getAuthSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (session) {
      throw redirect({ to: '/' })
    }

    return session
  },
)

export const getAuthDashboardSessionFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })

  return session
})

// MAGIC LINK
export const magicLink = createServerFn({
  method: 'POST',
})
  .validator(magicLinkSchema)
  .handler(async ({ data }) => {
    const { callbackURL, email, name } = data

    const headers = getRequestHeaders()

    const { status } = await auth.api.signInMagicLink({
      body: {
        email,
        name,
        callbackURL,
      },
      headers,
    })

    return status
  })
