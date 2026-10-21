import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '../-components/signup-form'
import { AuthRings } from '../-components/auth-ring'
import { AuthLayout } from '../-components/auth-layout'
import BackToHomeLink from '../-components/back-to-home-link'

export const Route = createFileRoute('/(auth)/signup/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <AuthRings />
      <BackToHomeLink />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <AuthLayout showLegalNotice>
          <SignupForm />
        </AuthLayout>
      </div>
    </div>
  )
}
