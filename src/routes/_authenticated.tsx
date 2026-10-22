import { getAuthDashboardSessionFn } from '#/lib/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const session = await getAuthDashboardSessionFn()

    if (!session) {
      throw redirect({ to: '/signin', search: location.href })
    }

    return { auth: session.user }
  },
  component: () => <Outlet />,
})
