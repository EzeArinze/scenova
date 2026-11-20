import { createServerFn } from '@tanstack/react-start'
import { and, eq, inArray, isNull, or, sql } from 'drizzle-orm'
import z from 'zod'
import db from '#/db'
import { presenter, project } from '#/db/schema'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { PLATFORM_VALUES, TONE_VALUES } from '#/utils/projects/constants'

// Only these stages are editable. Once a render starts, the plan is frozen.
const EDITABLE = ['drafting', 'ready'] as const

const analysisPatchSchema = z
  .object({
    projectId: z.string().uuid(),
    productName: z.string().trim().min(1).max(80).optional(),
    confirmed: z.boolean().optional(),
    // null clears an answer.
    platform: z.enum(PLATFORM_VALUES).nullable().optional(),
    tone: z.enum(TONE_VALUES).nullable().optional(),
    questionsDone: z.boolean().optional(),
  })
  .refine(
    ({ projectId: _id, ...patch }) =>
      Object.values(patch).some((v) => v !== undefined),
    { message: 'Nothing to update' },
  )

/**
 * Saves the answers from the drafting screen (product confirmed or renamed,
 * where it will run, tone, "questions done") into project.analysis. Only the
 * keys sent are touched; everything else in the JSON is kept.
 */
export const updateProjectAnalysis = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(analysisPatchSchema)
  .handler(async ({ data, context }) => {
    const { projectId, ...patch } = data

    const set: Record<string, string | boolean> = {}
    const remove: string[] = []
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) continue
      if (value === null) remove.push(key)
      else set[key] = value
    }

    // One statement, so two quick edits cannot overwrite each other:
    // merge the new keys, then drop the cleared ones.
    let next = sql`${project.analysis} || ${JSON.stringify(set)}::jsonb`
    if (remove.length > 0) {
      next = sql`(${next}) - ARRAY[${sql.join(
        remove.map((k) => sql`${k}`),
        sql`, `,
      )}]::text[]`
    }

    const rows = await db
      .update(project)
      .set({ analysis: next })
      .where(
        and(
          eq(project.id, projectId),
          eq(project.userId, context.user.id),
          isNull(project.deletedAt),
          inArray(project.status, [...EDITABLE]),
        ),
      )
      .returning({ id: project.id })

    if (rows.length === 0) throw new Error('Project not found')
    return { ok: true as const }
  })

const presenterSchema = z.object({
  projectId: z.string().uuid(),
  presenterId: z.string().uuid().nullable(), // null = no presenter
})

export const setProjectPresenter = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(presenterSchema)
  .handler(async ({ data, context }) => {
    const userId = context.user.id

    await db.transaction(async (tx) => {
      const [p] = await tx
        .select({ mode: project.mode })
        .from(project)
        .where(
          and(
            eq(project.id, data.projectId),
            eq(project.userId, userId),
            isNull(project.deletedAt),
            inArray(project.status, [...EDITABLE]),
          ),
        )
        .for('update')
      if (!p) throw new Error('Project not found')

      if (data.presenterId !== null) {
        if (p.mode !== 'ugc') throw new Error('This ad has no presenter')

        // Built-in presenters (userId null) or the user's own, nobody else's.
        const [found] = await tx
          .select({ id: presenter.id })
          .from(presenter)
          .where(
            and(
              eq(presenter.id, data.presenterId),
              or(isNull(presenter.userId), eq(presenter.userId, userId)),
            ),
          )
        if (!found) throw new Error('Presenter not found')
      }

      await tx
        .update(project)
        .set({ presenterId: data.presenterId })
        .where(eq(project.id, data.projectId))
    })

    return { ok: true as const }
  })
