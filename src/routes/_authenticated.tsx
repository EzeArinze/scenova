import { getAuthDashboardSessionFn } from '#/lib/auth.functions'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getAuthDashboardSessionFn()

    return { auth: session.user }
  },
  component: () => <Outlet />,
})
