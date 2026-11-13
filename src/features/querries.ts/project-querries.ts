import { queryOptions } from '@tanstack/react-query'
import { getProject, listPresenters } from '../server/projects/get_projects'

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', 'detail', id] as const,
  presenters: ['presenters'] as const,
}

export const projectQuery = (id: string) =>
  queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject({ data: { id } }),
    refetchInterval: (query) =>
      query.state.data?.project.status === 'drafting' ? 3000 : false,
    retry: false, // a wrong id should show "not found" at once, not after retries
  })

export const presentersQuery = () =>
  queryOptions({
    queryKey: projectKeys.presenters,
    queryFn: () => listPresenters(),
    staleTime: 5 * 60 * 1000,
  })
