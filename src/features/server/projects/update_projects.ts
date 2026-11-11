import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { updateProjectSchema } from './schema'
import { project } from '#/db/schemas/project.schema'
import { and, eq, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm/sql/sql'
import db from '#/db'

export const updateProject = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(updateProjectSchema)
  .handler(async ({ data, context }) => {
    const hasSettings = data.settings && Object.keys(data.settings).length > 0
    const hasAnalysis = data.analysis && Object.keys(data.analysis).length > 0

    if (
      data.title === undefined &&
      data.brief === undefined &&
      data.presenterId === undefined &&
      !hasSettings &&
      !hasAnalysis
    ) {
      return { ok: true as const }
    }

    await db
      .update(project)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.brief !== undefined && { brief: data.brief }),
        ...(data.presenterId !== undefined && {
          presenterId: data.presenterId,
        }),

        ...(hasSettings && {
          settings: sql`${project.settings} || ${JSON.stringify(data.settings)}::jsonb`,
        }),

        ...(hasAnalysis && {
          analysis: sql`coalesce(${project.analysis}, '{}'::jsonb) || ${JSON.stringify(data.analysis)}::jsonb`,
        }),
      })
      .where(
        and(
          eq(project.id, data.projectId),
          eq(project.userId, context.user.id),
          isNull(project.deletedAt),
        ),
      )

    return { ok: true as const }
  })
