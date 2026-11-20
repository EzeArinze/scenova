import { createServerFn } from '@tanstack/react-start'
import { getPresignedUrl } from '@tigrisdata/storage'
import db from '#/db'
import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { id } from './schema'

const READ_URL_SECONDS = 60 * 60

/** Signed read URL for a private object, or null if it cannot be signed. */
async function signRead(storageKey: string) {
  const { data, error } = await getPresignedUrl(storageKey, {
    operation: 'get',
    expiresIn: READ_URL_SECONDS,
  })
  return error || !data ? null : data.url
}

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
        const url = await signRead(a.storageKey)
        return url ? { id: a.id, url, width: a.width, height: a.height } : null
      }),
    )
    return photos.filter((p): p is NonNullable<typeof p> => p !== null)
  })

export const listPresenters = createServerFn({ method: 'GET' })
  .middleware([UnauthorizedMiddleware])
  .handler(async ({ context }) => {
    const { id } = context.user

    const rows = await db.query.presenter.findMany({
      where: (p, { or, isNull, eq }) => or(isNull(p.userId), eq(p.userId, id)),
      orderBy: (p, { asc }) => asc(p.createdAt),
    })

    return Promise.all(
      rows.map(async (r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        imageUrl: await signRead(r.storageKey),
      })),
    )
  })
