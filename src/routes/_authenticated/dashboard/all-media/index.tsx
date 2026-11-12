import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MediaSearch } from '../-components/home/media-search'

export const Route = createFileRoute('/_authenticated/dashboard/all-media/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [query, setQuery] = useState('')

  return (
    <div>
      <header className="px-4 pt-4 md:px-6">
        <MediaSearch value={query} onChange={setQuery} />
      </header>
    </div>
  )
}
