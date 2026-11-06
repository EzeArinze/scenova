import { useProject } from '#/utils/projects-utils/mock-api'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { ProjectHeader } from '../-components/project-header'
import { DraftingView } from '../-components/drafting-view'
import { StoryboardView } from '../-components/storyboard'

export const Route = createFileRoute(
  '/_authenticated/dashboard/projects/$project_id/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { project_id } = Route.useParams()
  const project = useProject(project_id)

  if (!project) {
    return (
      <div className="grid min-h-full place-items-center px-4 py-20 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="font-serif text-3xl font-medium">Project not found</h1>
          <p className="text-muted-foreground">
            It may have been deleted, or it was only kept in this tab and the
            page was refreshed.
          </p>
          <Link
            to="/dashboard"
            className="inline-block text-sm font-semibold text-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  function handleGenerate() {
    // TODO: hold credits, start the render, move to the Render stage.
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
