import { getAuthDashboardSessionFn } from '#/lib/auth/auth.functions'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getAuthDashboardSessionFn()

    if (!session) {
      throw redirect({ to: '/signin' })
    }

    return { auth: session.user }
  },
  component: () => <Outlet />,
})
