import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { remove } from '@tigrisdata/storage'
import { eq } from 'drizzle-orm'
import z from 'zod'
import db from '#/db'
import { asset } from '#/db/schema'

export const deleteUpload = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(z.object({ key: z.string().min(1).max(512) }))
  .handler(async ({ data, context }) => {
    // Only the owner's files.
    if (!data.key.startsWith(`${context.user.id}/`)) {
      throw new Error('Invalid file')
    }

    // Never delete a file a project already uses.
    const [used] = await db
      .select({ id: asset.id })
      .from(asset)
      .where(eq(asset.storageKey, data.key))
      .limit(1)
    if (used) return { deleted: false as const }

    const { error } = await remove(data.key)
    if (error) throw error
    return { deleted: true as const }
  })
