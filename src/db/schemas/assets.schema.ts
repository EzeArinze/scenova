import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { project } from './project.schema'
import { relations } from 'drizzle-orm'
import { asset_status, asset_kind } from '../utils'

export type AssetQualityFlags = {
  blurry?: boolean
  tooDark?: boolean
  tooSmall?: boolean
  faceDetected?: boolean
  logoDetected?: boolean
}

export const asset = pgTable(
  'asset',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id').references(() => project.id, {
      onDelete: 'cascade',
    }),
    kind: text('kind', { enum: asset_kind }).notNull(),
    storageKey: text('storage_key').notNull().unique(), // u/{userId}/p/{projectId}/...
    mime: text('mime').notNull(),
    bytes: bigint('bytes', { mode: 'number' }),
    width: integer('width'),
    height: integer('height'),
    durationMs: integer('duration_ms'),
    status: text('status', { enum: asset_status })
      .notNull()
      .default('uploading'),
    qualityFlags: jsonb('quality_flags').$type<AssetQualityFlags>(),
    meta: jsonb('meta').$type<Record<string, unknown>>(),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('asset_user_kind_idx').on(table.userId, table.kind),
    index('asset_project_idx').on(table.projectId),
  ],
)

export const assetRelations = relations(asset, ({ one }) => ({
  user: one(user, { fields: [asset.userId], references: [user.id] }),
  project: one(project, {
    fields: [asset.projectId],
    references: [project.id],
  }),
}))

export type Asset = typeof asset.$inferSelect
export type NewAsset = typeof asset.$inferInsert
