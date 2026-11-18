import { useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import {
  projectPhotosQuery,
  projectQuery,
} from '#/features/querries.ts/project-querries'
import { ProjectHeader } from './project-header'
import { DraftingView } from './drafting-view'
import { StoryboardView } from './storyboard'
import { toProjectView } from '#/features/server/helpers'

export default function ProjectView({ project_id }: { project_id: string }) {
  const { data } = useSuspenseQuery(projectQuery(project_id))
  const { data: photos } = useSuspenseQuery(projectPhotosQuery(project_id))

  const project = useMemo(
    () =>
      toProjectView({
        project: data.project,
        scenes: data.scenes,
        photoUrls: photos.map((p) => p.url),
      }),
    [data, photos],
  )

  // Generating and done have no screens yet (later steps).
  if (!project) {
    return (
      <div className="grid min-h-full place-items-center px-4 py-20 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="font-serif text-3xl font-medium">
            {data.project.title}
          </h1>
          <p className="text-muted-foreground">
            This ad is past the storyboard. Its progress and results screens are
            built in a later step.
          </p>
        </div>
      </div>
    )
  }

  function handleGenerate() {
    // TODO (render step): hold credits, start the render, move to Generating.
    console.info('generate', project_id)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-full flex-col gap-7 px-4 pb-14 md:px-8">
        <ProjectHeader name={project.name} status={project.status} />
        {project.status === 'drafting' ? (
          <DraftingView key="drafting" project={project} />
        ) : (
          <StoryboardView
            key="ready"
            project={project}
            onGenerate={handleGenerate}
          />
        )}
      </div>
    </MotionConfig>
  )
}
