import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  return (
    <div>
      Hello {auth.name}
      <pre className="overflow-auto rounded-lg bg-muted p-4 mt-4 w-4xl mx-auto text-xs">
        {JSON.stringify(
          {
            hasSession: !!auth.id,
            user: auth.name,
            email: auth.email,
            verified: auth.emailVerified,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
}
