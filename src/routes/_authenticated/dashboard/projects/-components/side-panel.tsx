import type { Presenter, Project } from '#/types/project-types'
import { formatTime } from '#/utils/projects-utils'
import { ShieldCheck, Sparkles } from 'lucide-react'

const PLATFORM_LABEL = {
  tiktok: 'TikTok',
  reels: 'Instagram Reels',
  shorts: 'YouTube Shorts',
  instagram: 'Instagram',
} as const

const TONE_LABEL = {
  casual: 'Casual tone',
  energetic: 'Energetic tone',
  premium: 'Calm and premium tone',
  funny: 'Funny tone',
} as const

export function BriefCard({ project }: { project: Project }) {
  const { brief, analysis, mode } = project
  const photo = brief.photoUrls[0]
  const chips = [
    brief.platform ? PLATFORM_LABEL[brief.platform] : null,
    brief.tone ? TONE_LABEL[brief.tone] : null,
  ].filter(Boolean)

  return (
    <section className="space-y-3.5 rounded-[20px] border border-border bg-card p-[18px]">
      <h2 className="text-[15px] font-bold">Your brief</h2>

      <div className="flex items-center gap-3">
        {photo ? (
          <img
            src={photo}
            alt="Your product photo"
            className="size-16 shrink-0 rounded-[14px] border border-border object-cover"
          />
        ) : (
          <div className="size-16 shrink-0 rounded-[14px] bg-muted" />
        )}
        <div className="min-w-0">
          <div className="truncate font-bold">
            {analysis?.productName ?? 'Reading your photo…'}
          </div>
          <div className="text-xs text-muted-foreground">
            {analysis
              ? `Spotted in your photo · ${analysis.category}`
              : `${brief.photoUrls.length} photo attached`}
          </div>
        </div>
      </div>

      {brief.idea && (
        <p className="rounded-xl bg-muted/60 px-3 py-2.5 text-[13px] leading-relaxed text-foreground/90">
          {`“${brief.idea}”`}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
          {mode === 'ugc' ? 'UGC with an avatar' : 'Product photo ad'}
        </span>
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold"
          >
            {chip}
          </span>
        ))}
      </div>
    </section>
  )
}

export function FormatCard({
  project,
  totalSeconds,
}: {
  project: Project
  totalSeconds: number
}) {
  const rows: [string, string][] = [
    ['Format', project.ratio === '9:16' ? '9:16 vertical' : project.ratio],
    ['Length', totalSeconds ? formatTime(totalSeconds) : 'Worked out soon'],
    ['Versions', project.versions === 1 ? '1' : String(project.versions)],
    ['Voice and captions', 'Auto'],
  ]
  return (
    <section className="rounded-[20px] border border-border bg-card px-[18px] py-1.5">
      <dl>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex min-h-12 items-center justify-between border-b border-border/70 last:border-b-0"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function GenerateCard({
  credits,
  presenter,
  disabled,
  pending,
  onGenerate,
}: {
  credits: number | null
  presenter: Presenter | null
  /** Hard disable (e.g. while drafting). */
  disabled?: boolean
  /** Replaces the label while the plan is still being written. */
  pending?: boolean
  onGenerate?: () => void
}) {
  return (
    <section className="space-y-3.5 rounded-[20px] border border-primary/30 bg-card p-[18px]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[13px] text-muted-foreground">This will use</div>
          {credits === null ? (
            <div className="text-lg font-bold text-muted-foreground">
              Worked out once the plan is ready
            </div>
          ) : (
            <div className="text-3xl leading-tight font-bold tracking-tight tabular-nums">
              {credits}{' '}
              <span className="text-base font-semibold text-muted-foreground">
                credits
              </span>
            </div>
          )}
        </div>
        {presenter && (
          <div className="flex items-center gap-2 text-[13px] text-foreground/90">
            <span
              aria-hidden
              className="size-[22px] rounded-full"
              style={{ background: presenter.gradient }}
            />
            {presenter.name} presents
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onGenerate}
        className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-primary text-[15px] font-bold text-primary-foreground transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:active:scale-100"
      >
        {pending ? (
          'Drafting…'
        ) : (
          <>
            <Sparkles aria-hidden className="size-[18px]" />
            Generate ad
          </>
        )}
      </button>

      <p className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-emerald-400"
        />
        {pending
          ? 'Planning is free. You can leave this page and come back to it in Projects.'
          : 'Nothing is charged until you press this. If a render fails, your credits come back automatically.'}
      </p>
    </section>
  )
}
