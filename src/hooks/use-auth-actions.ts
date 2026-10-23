import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { toast } from '#/components/ui/toast'
import { authClient } from '#/lib/auth-client'
import type { Provider } from '#/lib/auth/types'
import { signInCheck, signUpCheck } from '#/z-schemas/auth.schema'

type AuthMode = 'signin' | 'signup'

type AuthOptions = {
  authActionType: AuthMode
  callbackUrl?: string
}

type MagicLinkInput = {
  email: string
  name?: string
}

export function useAuthActions({
  authActionType,
  callbackUrl = '/dashboard',
}: AuthOptions) {
  const [isPending, setIsPending] = useState(false)
  const [magicLinkPending, setMagicLinkPending] = useState(false)

  const sendMagicLink = async ({ email, name }: MagicLinkInput) => {
    setMagicLinkPending(true)

    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        ...(name ? { name } : {}),
        callbackURL: callbackUrl,
      })

      if (error) {
        toast.add({
          type: 'error',
          description: error.message || 'Unable to send the sign-in link.',
        })
      }
    } catch {
      toast.add({
        type: 'error',
        description: 'A network error occurred. Please try again.',
      })
    } finally {
      setMagicLinkPending(false)
    }
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()

    if (authActionType === 'signup') {
      const name = String(formData.get('name') ?? '').trim()
      const result = signUpCheck.safeParse({ email, name })

      if (!result.success) {
        toast.add({
          type: 'warning',
          description:
            result.error.issues[0]?.message ?? 'Please check your input.',
        })
        return
      }

      await sendMagicLink({
        email: result.data.email,
        name: result.data.name,
      })

      return
    }

    const result = signInCheck.safeParse({ email })

    if (!result.success) {
      toast.add({
        type: 'warning',
        description:
          result.error.issues[0]?.message ?? 'Please check your email.',
      })
      return
    }

    await sendMagicLink({
      email: result.data.email,
    })
  }

  const signUpWithProvider = async (provider: Provider) => {
    setIsPending(true)

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      })

      if (error) {
        toast.add({
          type: 'error',
          description: error.message || 'Unable to sign in. Please try again.',
        })
      }
    } catch {
      toast.add({
        type: 'error',
        description: 'A network error occurred. Please try again.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return { isPending, magicLinkPending, signUpWithProvider, handleSubmit }
}
