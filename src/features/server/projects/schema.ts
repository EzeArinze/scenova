import z from 'zod'

export const id = z.object({ id: z.string().uuid() })

export const settingsSchema = z.object({
  ratio: z.enum(['9:16', '1:1', '16:9']),
  variations: z.number().int().min(1).max(4),
})

export const analysisPatchSchema = z
  .object({
    label: z.string().trim().max(200),
    category: z.string().trim().max(100),
    confirmed: z.boolean(),
    personMentioned: z.boolean(),
    platform: z.string().trim().max(100),
    tone: z.string().trim().max(100),
    questionsDone: z.boolean(),
  })
  .partial()
