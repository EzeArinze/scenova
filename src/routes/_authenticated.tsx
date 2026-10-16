import { getAuthDashboardSessionFn } from '#/lib/auth.functions'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    await getAuthDashboardSessionFn()
  },
  component: () => <Outlet />,
})
