import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { project } from './project.schema'
import { relations } from 'drizzle-orm'
import { asset } from './assets.schema'

export const scene = pgTable(
  'scene',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    spokenLine: text('spoken_line').notNull().default(''),
    visual: text('visual').notNull().default(''),
    seconds: integer('seconds').notNull(),
    stillAssetId: uuid('still_asset_id').references(() => asset.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('scene_project_position_idx').on(table.projectId, table.position),
  ],
)

export const sceneRelations = relations(scene, ({ one }) => ({
  project: one(project, {
    fields: [scene.projectId],
    references: [project.id],
  }),
  still: one(asset, { fields: [scene.stillAssetId], references: [asset.id] }),
}))

export type Scene = typeof scene.$inferSelect
export type NewScene = typeof scene.$inferInsert
