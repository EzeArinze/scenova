import { useAppMutation } from '#/utils/mutate'
import { createProject } from '../server/projects/create_project'
import { projectKeys } from '../querries.ts/project-querries'
import type { UploadedImage } from '#/hooks/use-image-attachments'

export type NewProjectInput = {
  idea: string
  useAvatar: boolean
  ratio: '9:16' | '1:1' | '16:9'
  versions: number
  images?: UploadedImage[]
}

export function useCreateProject() {
  return useAppMutation({
    mutationFn: (input: NewProjectInput) =>
      createProject({
        data: {
          brief: input.idea,
          mode: input.useAvatar ? 'ugc' : 'photo',
          settings: { ratio: input.ratio, variations: input.versions },
          images: input.images || [],
        },
      }),
    errorMessage: "Couldn't create your project. Please try again.",
    invalidates: [projectKeys.all],
  })
}
