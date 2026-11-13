import { Link, type ErrorComponentProps } from '@tanstack/react-router'

export function ProjectError({ error }: ErrorComponentProps) {
  const notFound =
    error instanceof Error && error.message === 'Project not found'

  return (
    <div className="grid min-h-full place-items-center px-4 py-20 text-center">
      <div className="max-w-sm space-y-3">
        <h1 className="font-serif text-3xl font-medium">
          {notFound ? 'Project not found' : 'Something went wrong'}
        </h1>
        <p className="text-muted-foreground">
          {notFound
            ? 'It may have been deleted, or the link is wrong.'
            : "We couldn't load this project."}
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
