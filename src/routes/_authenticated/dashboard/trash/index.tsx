import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/trash/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <p>Trash Page</p>
    </div>
  )
}
