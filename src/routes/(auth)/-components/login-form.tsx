// import { toast } from '#/components/ui/toast'
import { useAuthActions } from '#/hooks/use-auth-actions'
// import { authClient } from '#/lib/auth-client'
// import type { Provider } from '#/lib/auth/types'
// import { signInCheck } from '#/z-schemas/auth.schema'
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
// import { useTransition } from 'react'
// import type { SyntheticEvent } from 'react'

export function LoginForm() {
  // const [isPending, startTransition] = useTransition()
  // const [magicLinkPending, startMagicLink] = useTransition()

  const { handleSubmit, signUpWithProvider, isPending, magicLinkPending } =
    useAuthActions({ authActionType: 'signin' })

  // const signInWithProvider = (provider: Provider) => {
  //   startTransition(async () => {
  //     await authClient.signIn.social({
  //       provider,
  //       callbackURL: '/dashboard',
  //       fetchOptions: {
  //         onError: ({ error }) => {
  //           toast.add({
  //             type: 'error',
  //             description: error.message,
  //           })
  //         },
  //       },
  //     })
  //   })
  // }

  // const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
  //   event.preventDefault()

  //   const formData = new FormData(event.currentTarget)
  //   const email = String(formData.get('email')).trim()

  //   const validate = signInCheck.safeParse({ email })
  //   if (!validate.success) {
  //     toast.add({
  //       type: 'warning',
  //       description: 'Please provide input data',
  //     })
  //     return
  //   }

  //   startMagicLink(async () => {
  //     await authClient.signIn.magicLink({
  //       email: validate.data.email,
  //       callbackURL: '/dashboard',
  //       fetchOptions: {
  //         onError: ({ error }) => {
  //           toast.add({
  //             type: 'error',
  //             description: error.message,
  //           })
  //         },
  //       },
  //     })
  //   })
  // }

  const isPendingState = isPending || magicLinkPending

  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
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
