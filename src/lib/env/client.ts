import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const clientEnv = createEnv({
  clientPrefix: 'VITE_',

  client: {
    VITE_API_URL: z.url(),
    VITE_GOOGLE_CLIENT_ID: z.string(),
  },

  runtimeEnv: import.meta.env,
})
