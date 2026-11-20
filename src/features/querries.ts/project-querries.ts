import { queryOptions } from '@tanstack/react-query'
import {
  getProject,
  getProjectPhotos,
  listPresenters,
} from '../server/projects/get_project'

const PHOTO_STALE_MS = 45 * 60 * 1000

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', 'detail', id] as const,
  photos: (id: string) => ['projects', 'photos', id] as const,
  presenters: ['presenters'] as const,
}

export const projectQuery = (id: string) =>
  queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject({ data: { id } }),
    refetchInterval: (query) =>
      query.state.data?.project.status === 'drafting' ? 6000 : false,
    retry: false,
  })

export const projectPhotosQuery = (id: string) =>
  queryOptions({
    queryKey: projectKeys.photos(id),
    queryFn: () => getProjectPhotos({ data: { id } }),
    staleTime: PHOTO_STALE_MS,
    refetchOnWindowFocus: false,
  })

export const presentersQuery = () =>
  queryOptions({
    queryKey: projectKeys.presenters,
    queryFn: () => listPresenters(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
