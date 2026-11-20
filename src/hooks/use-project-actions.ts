import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from '#/features/querries.ts/project-querries'
import {
  withAnalysis,
  withLine,
  withMoved,
  withoutScene,
  withPresenter,
  withSeconds,
  type ProjectData,
} from '#/helpers/catch-patches'
import type { Platform, Tone } from '#/types/project-types'
import { updateScene } from '#/features/server/scene/update-scene'
import { moveScene } from '#/features/server/scene/move-scene'
import { deleteScene } from '#/features/server/scene/delete-scene'
import { duplicateScene } from '#/features/server/scene/duplicate-scene'
import { addScene } from '#/features/server/scene/add-scene'
import {
  setProjectPresenter,
  updateProjectAnalysis,
} from '#/features/server/projects/update_projects'
import { toast } from '#/components/ui/toast'

type Answers = {
  platform?: Platform | null
  tone?: Tone | null
  questionsDone?: boolean
  productName?: string
  confirmed?: boolean
}

// Swap this for your toast (#/components/ui/toast); I have not seen its API.
// A failed save has already been rolled back on screen by the time it runs.
function reportEditError(error: unknown) {
  console.error(error)
}

/**
 * One edit: show `patch` at once, save with `run`, roll back if the save fails.
 * Without `patch` (add, duplicate) the screen waits for the server's answer.
 */
function useEdit<V>(
  projectId: string,
  run: (vars: V) => Promise<unknown>,
  patch?: (data: ProjectData, vars: V) => ProjectData,
) {
  const qc = useQueryClient()
  const queryKey = projectKeys.detail(projectId)
  const mutationKey = ['project-edit', projectId]

  return useMutation<unknown, Error, V, { previous?: ProjectData }>({
    mutationKey,
    mutationFn: run,
    onMutate: async (vars) => {
      if (!patch) return {}
      // A poll that lands now would overwrite the optimistic change.
      await qc.cancelQueries({ queryKey })
      const previous = qc.getQueryData<ProjectData>(queryKey)
      if (previous) qc.setQueryData(queryKey, patch(previous, vars))
      return { previous }
    },
    onError: (error, _vars, context) => {
      if (context?.previous) qc.setQueryData(queryKey, context.previous)
      toast.add({ type: 'error', description: error.message })
      reportEditError(error)
    },
    onSettled: () => {
      // Refetch once, after the LAST pending edit, so quick successive edits
      // (stepper clicks) do not flicker back to older server data.
      if (qc.isMutating({ mutationKey }) === 1) {
        void qc.invalidateQueries({ queryKey })
      }
    },
  })
}

/** The storyboard's edit actions, saved to the database. */
export function useProjectActions(projectId: string) {
  const seconds = useEdit(
    projectId,
    (v: { sceneId: string; seconds: number }) =>
      updateScene({ data: { id: v.sceneId, seconds: v.seconds } }),
    (d, v) => withSeconds(d, v.sceneId, v.seconds),
  )
  const line = useEdit(
    projectId,
    (v: { sceneId: string; line: string }) =>
      updateScene({ data: { id: v.sceneId, spokenLine: v.line } }),
    (d, v) => withLine(d, v.sceneId, v.line),
  )
  const move = useEdit(
    projectId,
    (v: { sceneId: string; direction: 'up' | 'down' }) =>
      moveScene({ data: { id: v.sceneId, direction: v.direction } }),
    (d, v) => withMoved(d, v.sceneId, v.direction),
  )
  const remove = useEdit(
    projectId,
    (v: { sceneId: string }) => deleteScene({ data: { sceneId: v.sceneId } }),
    (d, v) => withoutScene(d, v.sceneId),
  )
  const duplicate = useEdit(projectId, (v: { sceneId: string }) =>
    duplicateScene({ data: { sceneId: v.sceneId } }),
  )

  const add = useEdit(projectId, (_v: void) =>
    addScene({ data: { projectId } }),
  )

  const analysis = useEdit(
    projectId,
    (v: Answers) => updateProjectAnalysis({ data: { projectId, ...v } }),
    (d, v) => withAnalysis(d, v),
  )

  const presenter = useEdit(
    projectId,
    (v: { presenterId: string | null }) =>
      setProjectPresenter({ data: { projectId, presenterId: v.presenterId } }),
    (d, v) => withPresenter(d, v.presenterId),
  )

  return {
    // Scenes
    setSceneSeconds: (sceneId: string, s: number) =>
      seconds.mutate({ sceneId, seconds: s }),
    setSceneLine: (sceneId: string, text: string) =>
      line.mutate({ sceneId, line: text }),
    moveScene: (sceneId: string, direction: -1 | 1) =>
      move.mutate({ sceneId, direction: direction === -1 ? 'up' : 'down' }),
    deleteScene: (sceneId: string) => remove.mutate({ sceneId }),
    duplicateScene: (sceneId: string) => duplicate.mutate({ sceneId }),
    addScene: () => add.mutate(),

    // Drafting-screen answers
    updateBrief: (next: Pick<Answers, 'platform' | 'tone' | 'questionsDone'>) =>
      analysis.mutate(next),
    updateAnalysis: (next: Pick<Answers, 'productName' | 'confirmed'>) =>
      analysis.mutate(next),

    // Presenter (null = no presenter)
    setPresenter: (presenterId: string | null) =>
      presenter.mutate({ presenterId }),
  }
}
