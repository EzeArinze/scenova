import { authClient } from '#/lib/auth-client'

export function AuthDebug() {
  const { data: session, isPending, error } = authClient.useSession()

  return (
    <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
      {JSON.stringify(
        {
          isPending,
          hasSession: !!session,
          user: session?.user.email ?? null,
          error: error
            ? {
                message: error.message,
                status: error.status,
                statusText: error.statusText,
              }
            : null,
        },
        null,
        2,
      )}
    </pre>
  )
}
