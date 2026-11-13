import { createFileRoute } from '@tanstack/react-router'
import { MediaGrid } from '../-components/home/media-grid'
import { ProjectEmpty } from './-components/empty-projects'

export const Route = createFileRoute('/_authenticated/dashboard/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <main className="flex flex-1 flex-col px-4 md:px-6">
        {[].length === 0 ? <ProjectEmpty /> : <MediaGrid items={[]} />}
      </main>
    </div>
  )
}
