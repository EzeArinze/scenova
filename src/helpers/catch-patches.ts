// Pure edits applied to the cached project while a save is still in flight, so
// the screen reacts at once. If the save fails the hook puts the old data back;
// when the last save settles, the server's answer replaces all of this.

import type { getProject } from '#/features/server/projects/get_projects'
import { MAX_SCENE_SECONDS, MIN_SCENE_SECONDS } from '#/utils/projects'

export type ProjectData = Awaited<ReturnType<typeof getProject>>

export type AnalysisPatch = {
  productName?: string
  confirmed?: boolean
  /** null clears the answer. */
  platform?: string | null
  tone?: string | null
  questionsDone?: boolean
}

export function clampLength(seconds: number) {
  return Math.min(
    MAX_SCENE_SECONDS,
    Math.max(MIN_SCENE_SECONDS, Math.round(seconds)),
  )
}

export function withSeconds(
  d: ProjectData,
  sceneId: string,
  seconds: number,
): ProjectData {
  return {
    ...d,
    scenes: d.scenes.map((s) =>
      s.id === sceneId ? { ...s, seconds: clampLength(seconds) } : s,
    ),
  }
}

export function withLine(
  d: ProjectData,
  sceneId: string,
  spokenLine: string,
): ProjectData {
  return {
    ...d,
    scenes: d.scenes.map((s) => (s.id === sceneId ? { ...s, spokenLine } : s)),
  }
}

/** Swaps a scene with its neighbour and renumbers positions 0..n-1. */
export function withMoved(
  d: ProjectData,
  sceneId: string,
  direction: 'up' | 'down',
): ProjectData {
  const list = [...d.scenes].sort(
    (a, b) =>
      a.position - b.position ||
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
  const from = list.findIndex((s) => s.id === sceneId)
  const to = direction === 'up' ? from - 1 : from + 1
  if (from < 0 || to < 0 || to >= list.length) return d

  ;[list[from], list[to]] = [list[to], list[from]]
  return { ...d, scenes: list.map((s, position) => ({ ...s, position })) }
}

/** Never removes the last scene: a storyboard needs at least one. */
export function withoutScene(d: ProjectData, sceneId: string): ProjectData {
  if (d.scenes.length <= 1) return d
  return { ...d, scenes: d.scenes.filter((s) => s.id !== sceneId) }
}

/** Same rules as the server: only the keys sent change, null removes one. */
export function applyAnalysisPatch<A extends object>(
  analysis: A,
  patch: AnalysisPatch,
): A {
  const next: Record<string, unknown> = Object.fromEntries(
    Object.entries(analysis),
  )
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    if (value === null) delete next[key]
    else next[key] = value
  }
  return next as A // only keys of the analysis object are added or removed
}

export function withAnalysis(
  d: ProjectData,
  patch: AnalysisPatch,
): ProjectData {
  return {
    ...d,
    project: {
      ...d.project,
      analysis: applyAnalysisPatch(d.project.analysis, patch),
    },
  }
}

export function withPresenter(
  d: ProjectData,
  presenterId: string | null,
): ProjectData {
  return { ...d, project: { ...d.project, presenterId } }
}
