import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  index,
  jsonb,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { scene } from './scene.schema'
import { presenter } from './presenter.schema'
import { asset } from './assets.schema'
import { project_mode, ProjectStatus } from '../utils'

export type ProjectSettings = {
  ratio: '9:16' | '1:1' | '16:9'
  variations: number
}

export type ProjectAnalysis = {
  label?: string // "a vitamin C serum bottle"
  category?: string
  confirmed?: boolean // user answered "Is that right?"
  personMentioned?: boolean
  platform?: string // answer to "where will it run?"
  tone?: string // answer to "what tone?"
  questionsDone?: boolean // user finished or skipped the quick questions
}

export const mode = pgEnum('mode', project_mode)
export const project_status = pgEnum('project_status', ProjectStatus)

export const project = pgTable(
  'project',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull().default('Untitled ad'),
    mode: mode().notNull().default('photo'),
    status: project_status().notNull().default('drafting'),
    brief: text('brief').notNull().default(''),
    settings: jsonb('settings')
      .$type<ProjectSettings>()
      .notNull()
      .default({ ratio: '9:16', variations: 1 }),
    analysis: jsonb('analysis').$type<ProjectAnalysis>().notNull().default({}),
    // null = "No presenter" (voice-over). Only meaningful in ugc mode.
    presenterId: uuid('presenter_id').references(() => presenter.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('project_user_updated_idx').on(table.userId, table.updatedAt),
  ],
)

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, { fields: [project.userId], references: [user.id] }),
  presenter: one(presenter, {
    fields: [project.presenterId],
    references: [presenter.id],
  }),
  scenes: many(scene),
  assets: many(asset),
}))

export type Project = typeof project.$inferSelect
export type NewProject = typeof project.$inferInsert
