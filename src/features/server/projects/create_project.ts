import { UnauthorizedMiddleware } from '#/middleware/middleware'
import { createServerFn } from '@tanstack/react-start'
import { head, remove } from '@tigrisdata/storage'
import z from 'zod'
import { imageSchema, settingsSchema } from './schema'
import db from '#/db'
import { asset, project, type NewAsset } from '#/db/schema'
import {
  isAllowedImageType,
  isValidUploadKey,
  MAX_IMAGE_BYTES,
} from '#/utils/projects/image-rules'

export const createProjectSchema = z.object({
  brief: z.string().trim().max(2000).default(''),
  mode: z.enum(['photo', 'ugc', 'template']),
  settings: settingsSchema.optional(),
  images: z.array(imageSchema).max(4).default([]),
})

export const createProject = createServerFn({ method: 'POST' })
  .middleware([UnauthorizedMiddleware])
  .validator(createProjectSchema)
  .handler(async ({ data, context }) => {
    const userId = context.user.id

    if (data.mode !== 'template' && data.images.length === 0) {
      throw new Error('Add a product photo to continue')
    }

    const keys = data.images.map((i) => i.key)
    if (new Set(keys).size !== keys.length) {
      throw new Error('Duplicate file')
    }
    if (keys.some((key) => !isValidUploadKey(key, userId))) {
      throw new Error('Invalid file')
    }

    const verified = await Promise.all(
      data.images.map(async (img) => {
        const { data: meta, error } = await head(img.key)
        if (error || !meta) throw new Error('Upload not found')
        if (
          !isAllowedImageType(meta.contentType) ||
          meta.size > MAX_IMAGE_BYTES
        ) {
          await remove(img.key).catch(() => undefined)
          throw new Error('Invalid file')
        }
        return { ...img, mime: meta.contentType, bytes: meta.size }
      }),
    )

    // Project and assets succeed or fail together.
    const title = data.brief ? data.brief.slice(0, 48) : 'Untitled ad'

    return db.transaction(async (tx) => {
      const [row] = await tx
        .insert(project)
        .values({
          userId,
          title,
          mode: data.mode,
          brief: data.brief,
          ...(data.settings ? { settings: data.settings } : {}),
        })
        .returning({ id: project.id })

      if (verified.length > 0) {
        const rows: NewAsset[] = verified.map((img, position) => ({
          userId,
          projectId: row.id,
          kind: 'source_photo',
          storageKey: img.key,
          mime: img.mime,
          bytes: img.bytes,
          width: img.width,
          height: img.height,
          status: 'ready',
          position,
        }))

        await tx.insert(asset).values(rows)
      }

      return { id: row.id }
    })
  })
