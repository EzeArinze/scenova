import { apiMiddleware } from '#/middleware/middleware'
import { createFileRoute } from '@tanstack/react-router'
import { handleClientUpload } from '@tigrisdata/storage'

export const Route = createFileRoute('/api/upload/')({
  server: {
    middleware: [apiMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { data, error } = await handleClientUpload(body)

        if (error) {
          return Response.json({ error: error.message }, { status: 500 })
        }

        return Response.json({ data })
      },
    },
  },
})
