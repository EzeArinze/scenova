import { useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Minus,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import type { Scene } from '#/types/project-types'
import { EASE_OUT } from '#/utils/dashboard-contants'
import { MAX_SCENE_SECONDS, MIN_SCENE_SECONDS } from '#/utils/projects-utils'
import { IconButton } from '../../-components/icon-button'
import { SceneStill } from './scene-still'

type SceneCardProps = {
  scene: Scene
  index: number
  rangeLabel: string
  /** "Amara says" or "Voice-over". */
  speakerLabel: string
  canMoveUp: boolean
  canMoveDown: boolean
  canDelete: boolean
  onSeconds: (seconds: number) => void
  onMove: (direction: -1 | 1) => void
  onDuplicate: () => void
  onDelete: () => void
  onLine: (line: string) => void
  onChangeRequest: (instruction: string) => void
}

export function SceneCard({
  scene,
  index,
  rangeLabel,
  speakerLabel,
  canMoveUp,
  canMoveDown,
  canDelete,
  onSeconds,
  onMove,
  onDuplicate,
  onDelete,
  onLine,
  onChangeRequest,
}: SceneCardProps) {
  const n = index + 1
  const [instruction, setInstruction] = useState('')
  const [editingLine, setEditingLine] = useState(false)
  const [lineDraft, setLineDraft] = useState(scene.line)

  function submitChange(e: FormEvent) {
    e.preventDefault()
    const text = instruction.trim()
    if (!text || scene.updating) return
    onChangeRequest(text)
    setInstruction('')
  }

  function saveLine() {
    setEditingLine(false)
    if (lineDraft.trim() !== scene.line) onLine(lineDraft.trim())
  }

  function onLineKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      saveLine()
    }
    if (e.key === 'Escape') {
      setLineDraft(scene.line)
      setEditingLine(false)
    }
  }

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
      className="relative flex flex-wrap gap-4.5 rounded-[20px] border border-border bg-card p-4"
    >
      <div className="relative shrink-0">
        <SceneStill
          kind={scene.still}
          index={index}
          label={`Preview still for scene ${n}`}
          className="h-42.5 w-24 rounded-[14px]"
        />
        <span className="absolute top-2 left-2 grid size-6 place-items-center rounded-full bg-black/60 text-xs font-bold text-white">
          {n}
        </span>
      </div>

      <div className="flex min-w-0 flex-[1_1_20rem] flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
          <h3 className="text-base font-bold">{scene.title}</h3>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground tabular-nums">
            {rangeLabel}
          </span>
          <div className="flex-1" />
          <div
            role="group"
            aria-label={`Length of scene ${n}`}
            className="flex h-11 items-center gap-0.5 rounded-full border border-border bg-background px-1"
          >
            <button
              type="button"
              onClick={() => onSeconds(scene.seconds - 1)}
              disabled={scene.seconds <= MIN_SCENE_SECONDS}
              aria-label={`Make scene ${n} shorter`}
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-35"
            >
              <Minus aria-hidden className="size-4" />
            </button>
            <span className="min-w-8.5 text-center text-[13px] font-bold tabular-nums">
              {scene.seconds}s
            </span>
            <button
              type="button"
              onClick={() => onSeconds(scene.seconds + 1)}
              disabled={scene.seconds >= MAX_SCENE_SECONDS}
              aria-label={`Make scene ${n} longer`}
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-[scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-35"
            >
              <Plus aria-hidden className="size-4" />
            </button>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">
          {scene.action}
        </p>

        <div className="flex items-start gap-2.5 rounded-xl bg-muted/60 py-2.5 pr-2 pl-3.5">
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-xs text-muted-foreground">
              {speakerLabel}
            </div>
            {editingLine ? (
              <textarea
                autoFocus
                rows={2}
                value={lineDraft}
                onChange={(e) => setLineDraft(e.target.value)}
                onBlur={saveLine}
                onKeyDown={onLineKeyDown}
                aria-label={`${speakerLabel}, scene ${n}`}
                className="block w-full resize-none bg-transparent text-sm outline-none"
              />
            ) : (
              <div className="text-sm">
                {scene.line ? (
                  `“${scene.line}”`
                ) : (
                  <span className="text-muted-foreground">
                    Nothing said yet
                  </span>
                )}
              </div>
            )}
          </div>
          <IconButton
            aria-label={`Edit what is said in scene ${n}`}
            onClick={() => {
              setLineDraft(scene.line)
              setEditingLine(true)
            }}
          >
            <Pencil aria-hidden className="size-4" />
          </IconButton>
        </div>

        {scene.caption && (
          <div className="flex items-center gap-2.5 text-[13px]">
            <span className="text-muted-foreground">On screen</span>
            <span className="rounded-lg bg-muted px-2.5 py-1 font-semibold">
              {scene.caption}
            </span>
          </div>
        )}

        <form
          onSubmit={submitChange}
          className="flex flex-wrap items-center gap-1.5"
        >
          <label className="block min-w-0 flex-[1_1_12rem]">
            <span className="sr-only">Change scene {n}</span>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={scene.updating}
              placeholder="Change this scene… e.g. make it funnier"
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-foreground/25 md:text-sm"
            />
          </label>
          <IconButton
            type="submit"
            aria-label={`Apply change to scene ${n}`}
            disabled={!instruction.trim() || scene.updating}
            className="bg-primary/20 text-primary"
          >
            <ArrowRight aria-hidden className="size-4" />
          </IconButton>
          <IconButton
            aria-label={`Move scene ${n} up`}
            disabled={!canMoveUp}
            onClick={() => onMove(-1)}
          >
            <ChevronUp aria-hidden className="size-4" />
          </IconButton>
          <IconButton
            aria-label={`Move scene ${n} down`}
            disabled={!canMoveDown}
            onClick={() => onMove(1)}
          >
            <ChevronDown aria-hidden className="size-4" />
          </IconButton>
          <IconButton aria-label={`Duplicate scene ${n}`} onClick={onDuplicate}>
            <Copy aria-hidden className="size-4" />
          </IconButton>
          <IconButton
            aria-label={`Delete scene ${n}`}
            disabled={!canDelete}
            onClick={onDelete}
          >
            <Trash2 aria-hidden className="size-4" />
          </IconButton>
        </form>
      </div>

      {scene.updating && (
        <div
          role="status"
          className="absolute inset-0 grid place-items-center rounded-[20px] bg-background/70 text-sm font-semibold"
        >
          Updating scene {n}…
        </div>
      )}
    </motion.article>
  )
}
