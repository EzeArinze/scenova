import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { project } from './project.schema'

export const presenter = pgTable('presenter', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  storageKey: text('storage_key').notNull(), // Tigris key of the face image
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const presenterRelations = relations(presenter, ({ one, many }) => ({
  user: one(user, { fields: [presenter.userId], references: [user.id] }),
  projects: many(project),
}))
