import { getAuthSessionFn } from '#/lib/auth/auth.functions'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    await getAuthSessionFn()
  },
  component: () => <Outlet />,
})
