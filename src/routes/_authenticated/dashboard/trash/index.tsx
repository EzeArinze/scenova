import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/trash/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/dashboard/trash/"!</div>
}
