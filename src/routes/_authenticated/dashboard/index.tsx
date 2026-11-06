import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { PromptComposer } from './-components/home/prompt-composer'
import type { StartAction } from './-components/home/start-cards'
import { MediaGrid } from './-components/home/media-grid'
import type { MediaItem } from './-components/home/media-grid'
import { rise, stagger } from '#/utils/dashboard-contants'
import { MediaSearch } from './-components/home/media-search'
import { HomeEmpty } from './-components/home/home-empty'
import { userObjectConstructor } from '#/utils/user-object-constructor'
import type {
  ComposerDraft,
  PromptComposerHandle,
} from './-components/home/types-and-constants/types'
import { createProject } from '#/utils/projects-utils/mock-api'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()

  const navigate = useNavigate()
  const { firstName, name } = userObjectConstructor({ user: auth })
  const reduceMotion = useReducedMotion()
  const composerRef = useRef<PromptComposerHandle>(null)
  const [query, setQuery] = useState('')

  // TODO: replace with the real loader (projects + assets, filtered by `query`).
  const media: MediaItem[] = []

  function handlePick(action: StartAction) {
    if (action === 'photo') composerRef.current?.openFilePicker()
    if (action === 'avatar') {
      composerRef.current?.setAvatar(true)
      composerRef.current?.focus()
    }
    // 'template': no templates route yet.
  }

  function handleSubmit(draft: ComposerDraft) {
    if (draft.images.length === 0) {
      // setMissingPhoto(true)
      return
    }
    // setMissingPhoto(false)

    const projectId = createProject({
      idea: draft.prompt,
      images: draft.images,
      useAvatar: draft.useAvatar,
      ratio: draft.settings.ratio,
      versions: draft.settings.variations,
    })
    void navigate({
      to: '/dashboard/projects/$project_id',
      params: { project_id: projectId },
    })
  }

  const UserName = firstName || name

  return (
    <motion.div
      variants={stagger}
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      className="flex min-h-full flex-col"
    >
      <motion.header variants={rise} className="px-4 pt-4 md:px-6">
        <MediaSearch value={query} onChange={setQuery} />
      </motion.header>

      <main className="flex flex-1 flex-col px-4 md:px-6">
        {media.length === 0 ? (
          <HomeEmpty firstName={UserName} onPick={handlePick} />
        ) : (
          <MediaGrid items={media} />
        )}
      </main>

      {/* The composer stays in every state, with or without media. */}
      <motion.div
        variants={rise}
        className="sticky bottom-0 bg-linear-to-t from-background via-background to-transparent px-4 pt-6 pb-4 md:px-6"
      >
        <PromptComposer ref={composerRef} onSubmit={handleSubmit} />
      </motion.div>
    </motion.div>
  )
}
