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
// import { authClient } from '#/lib/auth-client'
// import { toast } from '#/components/ui/toast'
// import { signUpCheck } from '#/z-schemas/auth.schema'
// import type { Provider } from '#/lib/auth/types'
import { useAuthActions } from '#/hooks/use-auth-actions'

export function SignupForm() {
  // const [isPending, startTransition] = useTransition()
  // const [magicLinkPending, startMagicLink] = useTransition()

  const { handleSubmit, signUpWithProvider, isPending, magicLinkPending } =
    useAuthActions({ authActionType: 'signup' })

  // const signUpWithProvider = (provider: Provider) => {
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

  //   const name = String(formData.get('name')).trim()
  //   const email = String(formData.get('email')).trim()

  //   const validate = signUpCheck.safeParse({ email, name })
  //   if (!validate.success) {
  //     toast.add({
  //       type: 'warning',
  //       description: 'Please provide input data',
  //     })
  //     return
  //   }

  //   startMagicLink(async () => {
  //     await authClient.signIn.magicLink({
  //       email,
  //       name,
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to create your account
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
          <FieldDescription>
            We will not share your email with anyone else.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="John doe"
            required
            disabled={isPendingState}
          />
          <FieldDescription>
            This is required for first time creating account.
          </FieldDescription>
        </Field>

        <Field>
          <Button type="submit">
            {magicLinkPending ? 'Sending Link..' : 'Create Account'}
          </Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field className="">
          <Button
            variant="outline"
            type="button"
            className={'space-x-1.5'}
            disabled={isPendingState}
            onClick={() => signUpWithProvider('google')}
          >
            <img src="/google.svg" alt="Google" className="size-4" />
            <span className="text-sm font-semibold">
              {isPending ? 'Signing Up...' : 'Sign up with Google'}
            </span>
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Already have an account? <Link to="/signin">Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
