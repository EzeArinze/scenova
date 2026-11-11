import z from 'zod'

export const projectId = z.object({ projectId: z.string().uuid() })

export const updateSceneSchema = z.object({
  id: z.string().uuid(),
  seconds: z.number().optional(),
  spokenLine: z.string().max(1000).optional(),
  visual: z.string().max(2000).optional(),
})
