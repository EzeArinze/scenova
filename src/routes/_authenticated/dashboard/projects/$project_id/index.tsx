import {
  projectPhotosQuery,
  projectQuery,
} from '#/features/querries.ts/project-querries'
import { createFileRoute } from '@tanstack/react-router'
import { ProjectError } from '../../-components/project-error'
import ProjectView from '../-components/project-view'
import { Suspense } from 'react'
import { noop } from '@tanstack/react-query'

export const Route = createFileRoute(
  '/_authenticated/dashboard/projects/$project_id/',
)({
  loader: ({ params, context }) => {
    void context.queryClient.query(projectQuery(params.project_id)).catch(noop)

    void context.queryClient
      .query(projectPhotosQuery(params.project_id))
      .catch(noop)
  },
  component: RouteComponent,
  errorComponent: ProjectError,
})

function RouteComponent() {
  const { project_id } = Route.useParams()

  return (
    <Suspense fallback={<div>Data Loading...</div>}>
      <ProjectView project_id={project_id} />
    </Suspense>
  )
}
