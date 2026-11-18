import { createServerFn } from '@tanstack/react-start'
import db from '#/db'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { id } from './schema'
import { getPresignedUrl } from '@tigrisdata/storage'

const PHOTO_URL_SECONDS = 60 * 60

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

export const getProjectPhotos = createServerFn({ method: 'GET' })
  .middleware([UnauthorizedMiddleware])
  .validator(id)
  .handler(async ({ data, context }) => {
    const userId = context.user.id

    const rows = await db.query.asset.findMany({
      where: (a, { and, eq, isNull }) =>
        and(
          eq(a.projectId, data.id),
          eq(a.userId, userId),
          eq(a.kind, 'source_photo'),
          eq(a.status, 'ready'),
          isNull(a.deletedAt),
        ),
      orderBy: (a, { asc }) => asc(a.position),
    })

    // A photo that fails to sign is left out instead of failing the page.
    const photos = await Promise.all(
      rows.map(async (a) => {
        const { data: signed, error } = await getPresignedUrl(a.storageKey, {
          operation: 'get',
          expiresIn: PHOTO_URL_SECONDS,
        })
        if (error || !signed) return null
        return { id: a.id, url: signed.url, width: a.width, height: a.height }
      }),
    )
    return photos.filter((p): p is NonNullable<typeof p> => p !== null)
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
