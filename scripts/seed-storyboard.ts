//   pnpm seed:storyboard <project-id> ready      full storyboard, 4 scenes
//   pnpm seed:storyboard <project-id> drafting   photo read, 2 scenes so far
//   pnpm seed:storyboard <project-id> reset      back to a fresh project
// (with npm: npm run seed:storyboard -- <project-id> ready)
//
// Add to package.json "scripts":
//   "seed:storyboard": "tsx --env-file=.env scripts/seed-storyboard.ts"

import { eq } from 'drizzle-orm'
import db from '#/db'
import { project, scene } from '#/db/schema'

const STATES = ['ready', 'drafting', 'reset'] as const
type State = (typeof STATES)[number]

const SCENES = [
  {
    spokenLine: 'I almost gave up on my skin. Then a friend handed me this.',
    visual:
      'Opens on the presenter holding the product up to the camera, close and direct.',
    seconds: 6,
  },
  {
    spokenLine: 'Every morning it looked tired, no matter what I tried.',
    visual:
      'Quick cut to the presenter at a mirror, touching their cheek and frowning.',
    seconds: 6,
  },
  {
    spokenLine: 'Two weeks in and people keep asking what I changed.',
    visual: 'Close-up of the product being used, light catching the texture.',
    seconds: 6,
  },
  {
    spokenLine: 'Try it for yourself. The link is right below.',
    visual: 'Back to the camera, product in hand, pointing down to the link.',
    seconds: 6,
  },
]

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const USAGE =
  'Usage: npm run seed:storyboard -- <project-id> <ready|drafting|reset>'

function isState(value: string | undefined): value is State {
  return STATES.some((s) => s === value)
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run with NODE_ENV=production.')
  }

  // pnpm passes the "--" separator through to the script (npm swallows it).
  const [projectId, state] = process.argv.slice(2).filter((a) => a !== '--')
  if (!projectId || !UUID.test(projectId) || !isState(state)) {
    console.error(USAGE)
    process.exit(1)
  }

  const existing = await db.query.project.findFirst({
    where: (p, { eq }) => eq(p.id, projectId),
    columns: { id: true },
  })
  if (!existing) throw new Error(`No project with id ${projectId}.`)

  const rows =
    state === 'ready' ? SCENES : state === 'drafting' ? SCENES.slice(0, 2) : []

  await db.transaction(async (tx) => {
    await tx.delete(scene).where(eq(scene.projectId, projectId))

    if (rows.length > 0) {
      await tx
        .insert(scene)
        .values(rows.map((r, position) => ({ projectId, position, ...r })))
    }

    await tx
      .update(project)
      .set(
        state === 'ready'
          ? {
              status: 'ready',
              title: 'Vitamin C serum ad',
              analysis: {
                label: 'a vitamin C serum bottle',
                category: 'Skincare',
                confirmed: true,
                platform: 'tiktok',
                tone: 'casual',
                questionsDone: true,
              },
            }
          : state === 'drafting'
            ? {
                status: 'drafting',
                title: 'Untitled ad',
                analysis: {
                  label: 'a vitamin C serum bottle',
                  category: 'Skincare',
                },
              }
            : { status: 'drafting', title: 'Untitled ad', analysis: {} },
      )
      .where(eq(project.id, projectId))
  })

  console.log(
    `Project ${projectId} is now "${state}" with ${rows.length} scenes.`,
  )
}

main()
  .then(() => process.exit(0)) // the db pool would otherwise keep the process open
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  })
