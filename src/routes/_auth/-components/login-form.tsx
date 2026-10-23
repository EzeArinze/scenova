import { useAuthActions } from '#/hooks/use-auth-actions'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'

export function LoginForm() {
  const { handleSubmit, signUpWithProvider, isPending, magicLinkPending } =
    useAuthActions({ authActionType: 'signin' })

  const isPendingState = isPending || magicLinkPending

  return (
    <form
      className="flex items-center justify-center p-6 md:p-8"
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">
            Login to your Scenova account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            disabled={isPendingState}
          />
        </Field>

        <Field>
          <Button type="submit">
            {magicLinkPending ? 'Sending Link..' : 'Login'}
          </Button>
        </Field>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        <Field>
          <Button
            variant="outline"
            type="button"
            className="space-x-1.5"
            disabled={isPendingState}
            onClick={() => signUpWithProvider('google')}
          >
            <img src="/google.svg" alt="Google" className="size-4" />
            <span className="text-sm font-semibold">
              {isPending ? 'Signing In...' : 'Login with Google'}
            </span>
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
