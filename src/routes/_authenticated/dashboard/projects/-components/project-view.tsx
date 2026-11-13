import { projectQuery } from '#/features/querries.ts/project-querries'
import { useSuspenseQuery } from '@tanstack/react-query'

export default function ProjectView({ project_id }: { project_id: string }) {
  const { data: project_data } = useSuspenseQuery(projectQuery(project_id))

  const { project } = project_data

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col gap-4 px-4 py-16">
      <h1 className="font-serif text-3xl font-medium">{project.title}</h1>
      <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
        <dt className="text-muted-foreground">Mode</dt>
        <dd>{project.mode}</dd>
        <dt className="text-muted-foreground">Status</dt>
        <dd>{project.status}</dd>
        <dt className="text-muted-foreground">Format</dt>
        <dd>
          {project.settings.ratio} · x{project.settings.variations}
        </dd>
        <dt className="text-muted-foreground">Brief</dt>
        <dd>{project.brief || 'No text, photo only'}</dd>
      </dl>
      <p className="text-sm text-muted-foreground">Storyboard goes here.</p>
    </div>
  )
}
