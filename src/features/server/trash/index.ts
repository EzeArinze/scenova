// db/project-trash.ts
import db from '#/db'
import { project } from '#/db/schemas/project.schema'
import { and, desc, eq, lt } from 'drizzle-orm'
import { liveProjects, trashedProjects } from '../helpers'

/** Move to trash (soft delete). */
export async function trashProject(projectId: string, userId: string) {
  const [row] = await db
    .update(project)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(project.id, projectId), eq(project.userId, userId), liveProjects),
    )
    .returning({ id: project.id })
  return row
}

/** Restore from trash. */
export async function restoreProject(projectId: string, userId: string) {
  const [row] = await db
    .update(project)
    .set({ deletedAt: null })
    .where(
      and(
        eq(project.id, projectId),
        eq(project.userId, userId),
        trashedProjects,
      ),
    )
    .returning({ id: project.id })
  return row
}

/** List the user's trash, newest first. */
export async function listTrash(userId: string) {
  return db
    .select()
    .from(project)
    .where(and(eq(project.userId, userId), trashedProjects))
    .orderBy(desc(project.deletedAt))
}

/** "Delete forever" from the trash UI. Only works on trashed projects. */
export async function purgeProject(projectId: string, userId: string) {
  const [row] = await db
    .delete(project)
    .where(
      and(
        eq(project.id, projectId),
        eq(project.userId, userId),
        trashedProjects,
      ),
    )
    .returning({ id: project.id })
  return row
}

/** Cron job: permanently delete anything trashed more than 30 days ago. */
export async function purgeExpiredTrash(days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  await db.delete(project).where(lt(project.deletedAt, cutoff))
}
