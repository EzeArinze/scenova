import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/create-adds/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/create-adds/"!</div>
}
