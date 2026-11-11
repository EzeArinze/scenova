import { createServerFn } from '@tanstack/react-start'
import db from '#/db'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { id } from './schema'

export const getProject = createServerFn({ method: 'GET' })
  .middleware([UnauthorizedMiddleware])
  .validator(id)
  .handler(async ({ data, context }) => {
    const { id } = context.user

    const row = await db.query.project.findFirst({
      where: (p, { and, eq, isNull }) =>
        and(eq(p.id, data.id), eq(p.userId, id), isNull(p.deletedAt)),
      with: {
        scenes: {
          orderBy: (s, { asc }) => [asc(s.position), asc(s.createdAt)],
        },
      },
    })
    if (!row) throw new Error('Project not found')
    const { scenes, ...p } = row
    return { project: p, scenes }
  })

/** Built-in avatars (userId null) plus the user's own. */
export const listPresenters = createServerFn({ method: 'GET' })
  .middleware([UnauthorizedMiddleware])
  .handler(async ({ context }) => {
    const { id } = context.user

    const presenters = await db.query.presenter.findMany({
      where: (p, { or, isNull, eq }) => or(isNull(p.userId), eq(p.userId, id)),
      orderBy: (p, { asc }) => asc(p.createdAt),
    })

    return presenters
  })
