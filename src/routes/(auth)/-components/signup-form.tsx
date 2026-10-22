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

export function SignupForm() {
  return (
    <form className="p-6 md:p-8">
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>

        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>
        <Field className="">
          <Button variant="outline" type="button" className={'space-x-1.5'}>
            <img src="/google.svg" alt="Google" className="size-4" />
            <span className="text-sm font-semibold">Sign up with Google</span>
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Already have an account? <Link to="/signin">Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
