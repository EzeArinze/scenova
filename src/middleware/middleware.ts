import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/signin' })
    }

    return next({ context: { session: session.user } })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const url = new URL(request.url)

    const isProtectedRoute = url.pathname.startsWith('/dashboard')

    const isAuthRoute =
      url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup')

    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (isProtectedRoute && !session) {
      throw redirect({ to: '/signin' })
    }

    if (isAuthRoute && session) {
      throw redirect({ to: '/' })
    }

    return next({
      context: {
        session: session?.user,
      },
    })
  },
)
