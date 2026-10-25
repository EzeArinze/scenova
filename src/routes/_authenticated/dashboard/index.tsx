import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  return <div>Hello - {auth.email.split('@')[0]}</div>
}
