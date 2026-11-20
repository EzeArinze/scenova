// import { apiMiddleware } from '#/middleware/middleware'
// import { createFileRoute } from '@tanstack/react-router'
// import { handleClientUpload } from '@tigrisdata/storage'

// export const Route = createFileRoute('/api/upload/')({
//   server: {
//     middleware: [apiMiddleware],
//     handlers: {
//       POST: async ({ request }) => {
//         const body = await request.json()
//         const { data, error } = await handleClientUpload(body)

//         if (error) {
//           return Response.json({ error: error.message }, { status: 500 })
//         }

//         return Response.json({ data })
//       },
//     },
//   },
// })

import { apiMiddleware } from '#/middleware/middleware'
import { isValidUploadKey } from '#/utils/projects/image-rules'
import { createFileRoute } from '@tanstack/react-router'
import { handleClientUpload } from '@tigrisdata/storage'
import z from 'zod'

const uploadRequestSchema = z.object({
  action: z.enum([
    'singlepart-init',
    'multipart-init',
    'multipart-get-parts',
    'multipart-complete',
  ]),
  name: z.string().min(1).max(512),
  uploadId: z.string().max(1024).optional(),
  parts: z.array(z.number().int().positive()).max(1000).optional(),
  partIds: z.array(z.record(z.string(), z.string())).max(1000).optional(),
})

export const Route = createFileRoute('/api/upload/')({
  server: {
    middleware: [apiMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const userId = context.user.id

        const body = await request.json().catch(() => null)
        const parsed = uploadRequestSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { error: 'Invalid upload request' },
            { status: 400 },
          )
        }

        if (!isValidUploadKey(parsed.data.name, userId)) {
          return Response.json({ error: 'Invalid file name' }, { status: 400 })
        }

        const { data, error } = await handleClientUpload(body)

        if (error) {
          console.error(error)
          return Response.json({ error: 'Upload failed' }, { status: 500 })
        }

        return Response.json({ data })
      },
    },
  },
})
