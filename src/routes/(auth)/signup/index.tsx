import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '../-components/signup-page'
import { AuthRings } from '../-components/auth-ring'

export const Route = createFileRoute('/(auth)/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <AuthRings />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
