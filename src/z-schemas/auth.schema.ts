import z from 'zod'

export const magicLinkSchema = z.object({
  email: z.email('Please provide valid email'),
  name: z.string().optional(),
  callbackURL: z.url().optional(),
})

export const signInCheck = magicLinkSchema.pick({ email: true })
export const signUpCheck = magicLinkSchema.pick({ email: true, name: true })
