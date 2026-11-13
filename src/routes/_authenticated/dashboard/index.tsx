import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { PromptComposer } from './-components/home/prompt-composer'
import type { StartAction } from './-components/home/start-cards'
import { MediaGrid } from './-components/home/media-grid'
import type { MediaItem } from './-components/home/media-grid'
import { stagger } from '#/utils/dashboard-contants'
import { HomeEmpty } from './-components/home/home-empty'
import { userObjectConstructor } from '#/utils/user-object-constructor'
import type {
  ComposerValue,
  PromptComposerHandle,
} from './-components/home/types-and-constants/types'
import { toast } from '#/components/ui/toast'
import { useCreateProject } from '#/features/mutations/use-create-project'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  const navigate = useNavigate()
  const { firstName, name } = userObjectConstructor({ user: auth })
  const reduceMotion = useReducedMotion()
  const composerRef = useRef<PromptComposerHandle>(null)
  const createProject = useCreateProject()

  // TODO: replace with the real loader (projects + assets, filtered by `query`).
  const media: MediaItem[] = []

  function handlePick(action: StartAction) {
    if (action === 'photo') composerRef.current?.openFilePicker()
    if (action === 'avatar') {
      composerRef.current?.setAvatar(true)
      composerRef.current?.focus()
    }

    if (action === 'template')
      toast.add({ type: 'info', description: 'Comming Soon...' })
  }

  function handleSubmit(draft: ComposerValue) {
    if (draft.images.length === 0 || createProject.isPending) {
      // setMissingPhoto(true)
      return
    }

    createProject.mutate(
      {
        idea: draft.prompt,
        useAvatar: draft.useAvatar,
        ratio: draft.settings.ratio,
        versions: draft.settings.variations,
      },
      {
        onSuccess: ({ id }) => {
          navigate({
            to: '/dashboard/projects/$project_id',
            params: { project_id: id },
          })
        },
      },
    )
  }

  const UserName = firstName || name

  return (
    <motion.div
      variants={stagger}
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      className="flex min-h-full flex-col"
    >
      <main className="flex flex-1 flex-col px-4 md:px-6">
        {media.length === 0 ? (
          <HomeEmpty firstName={UserName} onPick={handlePick} />
        ) : (
          <MediaGrid items={media} />
        )}
      </main>

      <div className="sticky bottom-0 bg-linear-to-t from-background via-background to-transparent px-4 pt-6 pb-4 md:px-6">
        <PromptComposer ref={composerRef} onSubmit={handleSubmit} />
      </div>
    </motion.div>
  )
}
