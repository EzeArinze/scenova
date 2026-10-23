import { betterAuth } from 'better-auth/minimal'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { magicLink } from 'better-auth/plugins'
import db from '#/db'
import { env } from './env/server'
import { APIError, createAuthMiddleware } from 'better-auth/api'

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true,
    max: 20,
    window: 60,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.body?.email && ctx.body?.email.endsWith('@example.com')) {
        throw new APIError('BAD_REQUEST', {
          message: 'Email must not end with @example.com',
        })
      }
    }),
  },
  plugins: [
    tanstackStartCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // send email to user
        console.log(email, url)
      },
    }),
  ],
})
