import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '#/components/ui/toast'
import { createProject } from '../server/projects/create_project'

export type NewProjectInput = {
  idea: string
  useAvatar: boolean
  ratio: '9:16' | '1:1' | '16:9'
  versions: number
}

type NavigateFn = ReturnType<typeof useNavigate>

/**
 * Saves a project, then goes straight to its page.
 * Photos are not sent yet: the Tigris upload step comes next.
 */
export function useCreateProject({ navigate }: { navigate: NavigateFn }) {
  // const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: NewProjectInput) =>
      createProject({
        data: {
          brief: input.idea,
          mode: input.useAvatar ? 'ugc' : 'photo',
          settings: { ratio: input.ratio, variations: input.versions },
        },
      }),
    onSuccess: ({ id }) =>
      navigate({
        to: '/dashboard/projects/$project_id',
        params: { project_id: id },
      }),
    onError: (error) => {
      console.error(error)
      toast.add({
        type: 'error',
        description: "Couldn't create your project. Please try again.",
      })
    },
  })
}
