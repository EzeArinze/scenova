import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { settingsSchema } from './schema'
import db from '#/db'
import { project } from '#/db/schema'

const createProjectSchema = z.object({
  brief: z.string().trim().max(2000).default(''),
  mode: z.enum(['photo', 'ugc', 'template']),
  settings: settingsSchema.optional(),
})

export const createProject = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(createProjectSchema)
  .handler(async ({ data, context }) => {
    const title = data.brief ? data.brief.slice(0, 48) : 'Untitled ad'
    const [row] = await db
      .insert(project)
      .values({
        userId: context.user.id,
        title,
        mode: data.mode,
        brief: data.brief,
        ...(data.settings ? { settings: data.settings } : {}),
      })
      .returning({ id: project.id })

    return { id: row.id }
  })
