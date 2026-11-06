import { useState } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import type { Platform, Project, Tone } from '#/types/project-types'
import { PageHeading, ProjectGrid } from './project-grid'
import { projectApi } from '#/utils/projects-utils/mock-api'
import { EASE_OUT, rise, stagger } from '#/utils/dashboard-contants'
import { SceneStill } from './scene-still'
import { ChipGroup } from './chip-group'
import { BriefCard, GenerateCard } from './side-panel'

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'reels', label: 'Instagram Reels' },
  { value: 'shorts', label: 'YouTube Shorts' },
  { value: 'instagram', label: 'Instagram' },
]

const TONES: { value: Tone; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'premium', label: 'Calm and premium' },
  { value: 'funny', label: 'Funny' },
]

/** Shown right after Send, while the storyboard is being written. */
export function DraftingView({ project }: { project: Project }) {
  const { analysis, brief, scenes, plannedScenes } = project
  const [correcting, setCorrecting] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const anyAnswer = brief.platform !== null || brief.tone !== null
  const remaining = Math.max(plannedScenes - scenes.length, 0)

  function saveCorrection() {
    const name = nameDraft.trim()
    if (!name) return
    projectApi.updateAnalysis(project.id, {
      productName: name,
      confirmed: true,
    })
    setCorrecting(false)
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <ProjectGrid
        main={
          <>
            <PageHeading
              title="Drafting your storyboard"
              subtitle="Reading your photo and your idea. While that runs, a quick answer or two will make the ad fit where it will be seen. Free so far."
            />

            {/* Confirm the product */}
            <motion.section
              variants={rise}
              aria-live="polite"
              className="flex flex-wrap items-center gap-4 rounded-[20px] border border-border bg-card p-4"
            >
              {brief.photoUrls[0] ? (
                <img
                  src={brief.photoUrls[0]}
                  alt="Your product photo"
                  className="size-[72px] shrink-0 rounded-[14px] border border-border object-cover"
                />
              ) : (
                <div className="size-[72px] shrink-0 rounded-[14px] bg-muted" />
              )}

              {!analysis && (
                <div
                  className="min-w-0 flex-[1_1_15rem] space-y-2"
                  role="status"
                >
                  <div className="font-bold">Looking at your photo…</div>
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
                </div>
              )}

              {analysis && !analysis.confirmed && !correcting && (
                <>
                  <div className="min-w-0 flex-[1_1_15rem]">
                    <div className="text-[15px] font-bold">
                      I see {analysis.label}. Is that right?
                    </div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground">
                      This helps me write scenes that fit your product.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        projectApi.updateAnalysis(project.id, {
                          confirmed: true,
                        })
                      }
                      className="h-11 rounded-full bg-primary px-[18px] text-sm font-bold text-primary-foreground transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    >
                      Yes, that's it
                    </button>
                    <button
                      type="button"
                      onClick={() => setCorrecting(true)}
                      className="h-11 rounded-full border border-border px-[18px] text-sm font-semibold transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    >
                      Not quite
                    </button>
                  </div>
                </>
              )}

              {analysis && !analysis.confirmed && correcting && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    saveCorrection()
                  }}
                  className="flex min-w-0 flex-[1_1_15rem] flex-wrap items-center gap-2"
                >
                  <label className="min-w-0 flex-[1_1_10rem]">
                    <span className="sr-only">What is your product?</span>
                    <input
                      autoFocus
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      placeholder="What is it? e.g. Hydrating face cream"
                      className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground/25 md:text-sm"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={!nameDraft.trim()}
                    className="h-11 rounded-full bg-primary px-[18px] text-sm font-bold text-primary-foreground transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-40"
                  >
                    Save
                  </button>
                </form>
              )}

              {analysis?.confirmed && (
                <div className="flex min-w-0 flex-[1_1_15rem] items-center gap-2.5">
                  <span className="grid size-[22px] place-items-center rounded-full bg-emerald-400/15 text-emerald-400">
                    <Check aria-hidden className="size-3" />
                  </span>
                  <div>
                    <div className="font-bold">{analysis.productName}</div>
                    <div className="text-[13px] text-muted-foreground">
                      Product confirmed
                    </div>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Quick questions */}
            {!brief.questionsDone && (
              <motion.section
                variants={rise}
                className="space-y-[22px] rounded-[20px] border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-base font-bold">Two quick questions</h2>
                  <button
                    type="button"
                    onClick={() =>
                      projectApi.updateBrief(project.id, {
                        questionsDone: true,
                      })
                    }
                    className="min-h-11 text-[13px] font-semibold text-primary"
                  >
                    {anyAnswer ? 'Done' : 'Skip, surprise me'}
                  </button>
                </div>
                <ChipGroup
                  label="Where will this ad run?"
                  value={brief.platform}
                  options={PLATFORMS}
                  onChange={(platform) =>
                    projectApi.updateBrief(project.id, { platform })
                  }
                />
                <ChipGroup
                  label="What should it feel like?"
                  value={brief.tone}
                  options={TONES}
                  onChange={(tone) =>
                    projectApi.updateBrief(project.id, { tone })
                  }
                />
              </motion.section>
            )}

            {/* Scenes arriving */}
            <motion.section
              variants={rise}
              aria-labelledby="drafting-scenes"
              className="space-y-4"
            >
              <div className="flex items-center gap-2.5">
                <h2 id="drafting-scenes" className="text-base font-bold">
                  Scenes
                </h2>
                <span
                  className="text-[13px] text-muted-foreground"
                  aria-live="polite"
                >
                  {remaining > 0
                    ? `Writing scene ${scenes.length + 1} of ${plannedScenes}…`
                    : 'Finishing up…'}
                </span>
              </div>

              {scenes.map((scene, i) => (
                <motion.article
                  key={scene.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                  className="flex flex-wrap gap-[18px] rounded-[20px] border border-border bg-card p-4"
                >
                  <SceneStill
                    kind={scene.still}
                    index={i}
                    label={`Preview still for scene ${i + 1}`}
                    className="h-[170px] w-24 shrink-0 rounded-[14px]"
                  />
                  <div className="min-w-0 flex-[1_1_20rem] space-y-3">
                    <h3 className="text-base font-bold">{scene.title}</h3>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {scene.action}
                    </p>
                    <div className="rounded-xl bg-muted/60 px-3.5 py-2.5">
                      <div className="mb-0.5 text-xs text-muted-foreground">
                        {project.presenterId ? 'Presenter says' : 'Voice-over'}
                      </div>
                      <div className="text-sm">{`“${scene.line}”`}</div>
                    </div>
                  </div>
                </motion.article>
              ))}

              {Array.from({ length: remaining }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  aria-hidden
                  className="flex flex-wrap gap-[18px] rounded-[20px] border border-border bg-card p-4"
                >
                  <div className="h-[170px] w-24 shrink-0 animate-pulse rounded-[14px] bg-muted motion-reduce:animate-none" />
                  <div className="min-w-0 flex-[1_1_20rem] space-y-3">
                    <div className="h-[18px] w-32 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
                    <div className="h-3.5 w-[90%] animate-pulse rounded-md bg-muted/70 motion-reduce:animate-none" />
                    <div className="h-3.5 w-2/3 animate-pulse rounded-md bg-muted/70 motion-reduce:animate-none" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-muted/50 motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </motion.section>
          </>
        }
        aside={
          <>
            <motion.div variants={rise}>
              <BriefCard project={project} />
            </motion.div>
            <motion.div variants={rise}>
              <GenerateCard credits={null} presenter={null} disabled pending />
            </motion.div>
          </>
        }
      />
    </motion.div>
  )
}
