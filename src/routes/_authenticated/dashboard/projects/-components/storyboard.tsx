import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { creditsFor, formatTime } from '#/utils/projects-utils'
import { PageHeading, ProjectGrid } from './project-grid'
import {
  projectApi,
  SUGGESTED_PRESENTERS,
} from '#/utils/projects-utils/mock-api'
import type { Project } from '#/types/project-types'
import { rise, stagger } from '#/utils/dashboard-contants'
import { PresenterPicker } from './presenter-picker'
import { SceneCard } from './scene-card'
import { BriefCard, FormatCard, GenerateCard } from './side-panel'

/** The editable plan, shown once drafting has finished. */
export function StoryboardView({
  project,
  onGenerate,
}: {
  project: Project
  onGenerate: () => void
}) {
  const { scenes, id } = project
  const presenter =
    SUGGESTED_PRESENTERS.find((p) => p.id === project.presenterId) ?? null
  const totalSeconds = scenes.reduce((sum, s) => sum + s.seconds, 0)
  const credits = creditsFor(totalSeconds, project.versions)
  const showPresenterPicker = project.mode === 'ugc'

  // Time range per scene, from a running total.
  let elapsed = 0
  const ranges = scenes.map((s) => {
    const start = elapsed
    elapsed += s.seconds
    return `${formatTime(start)} – ${formatTime(elapsed)}`
  })

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <ProjectGrid
        main={
          <>
            <PageHeading
              title="Here's your storyboard"
              subtitle="Read it through and change anything that feels off. Nothing is charged until you press Generate."
            />

            {showPresenterPicker && (
              <motion.section variants={rise} aria-labelledby="who-presents">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 id="who-presents" className="text-base font-bold">
                    Who presents?
                  </h2>
                  <span className="text-[13px] text-muted-foreground">
                    Suggested for your product
                  </span>
                </div>
                <PresenterPicker
                  options={SUGGESTED_PRESENTERS}
                  value={project.presenterId}
                  onChange={(presenterId) =>
                    projectApi.setPresenter(id, presenterId)
                  }
                  // TODO: pass onBrowse once the Avatars library page exists.
                />
              </motion.section>
            )}

            <motion.section variants={rise} aria-labelledby="scenes-heading">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 id="scenes-heading" className="text-base font-bold">
                  Scenes
                  <span className="ml-1.5 font-medium text-muted-foreground">
                    {scenes.length} {scenes.length === 1 ? 'scene' : 'scenes'} ·{' '}
                    {totalSeconds}s
                  </span>
                </h2>
                <button
                  type="button"
                  onClick={() => projectApi.addScene(id)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-[13px] font-semibold transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                >
                  <Plus aria-hidden className="size-4" />
                  Add scene
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {scenes.map((scene, i) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      index={i}
                      rangeLabel={ranges[i]}
                      speakerLabel={
                        presenter ? `${presenter.name} says` : 'Voice-over'
                      }
                      canMoveUp={i > 0}
                      canMoveDown={i < scenes.length - 1}
                      canDelete={scenes.length > 1}
                      onSeconds={(s) =>
                        projectApi.setSceneSeconds(id, scene.id, s)
                      }
                      onMove={(d) => projectApi.moveScene(id, scene.id, d)}
                      onDuplicate={() =>
                        projectApi.duplicateScene(id, scene.id)
                      }
                      onDelete={() => projectApi.deleteScene(id, scene.id)}
                      onLine={(line) =>
                        projectApi.setSceneLine(id, scene.id, line)
                      }
                      onChangeRequest={(text) =>
                        projectApi.requestSceneChange(id, scene.id, text)
                      }
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          </>
        }
        aside={
          <>
            <motion.div variants={rise}>
              <BriefCard project={project} />
            </motion.div>
            <motion.div variants={rise}>
              <FormatCard project={project} totalSeconds={totalSeconds} />
            </motion.div>
            <motion.div variants={rise}>
              <GenerateCard
                credits={credits}
                presenter={presenter}
                disabled={scenes.length === 0}
                onGenerate={onGenerate}
              />
            </motion.div>
          </>
        }
      />
    </motion.div>
  )
}
