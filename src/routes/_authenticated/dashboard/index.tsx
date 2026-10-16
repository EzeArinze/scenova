import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  return <div>Hello "/_authenticated/dashboard/"! {auth.name}</div>
}
