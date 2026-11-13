// lib/use-app-mutation.ts
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from '#/components/ui/toast'

/* ---------- optimistic helpers ---------- */

export type OptimisticUpdate<TVars> = {
  queryKey: QueryKey
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (current: any, vars: TVars) => any
}

/** Typed helper: gives you proper types for the cache shape inside `update`. */
export const optimistic = <TCache, TVars>(config: {
  queryKey: QueryKey
  update: (current: TCache | undefined, vars: TVars) => TCache | undefined
}) => config as OptimisticUpdate<TVars>

type Snapshot = { queryKey: QueryKey; previous: unknown }[]

/* ---------- options ---------- */

type Resolvable<TArgs extends unknown[], R> = R | ((...args: TArgs) => R)

const resolve = <TArgs extends unknown[], R>(
  value: Resolvable<TArgs, R> | undefined,
  ...args: TArgs
): R | undefined =>
  typeof value === 'function' ? (value as (...a: TArgs) => R)(...args) : value

export type AppMutationOptions<TData, TVars> = Pick<
  UseMutationOptions<TData, Error, TVars, Snapshot>,
  'mutationFn' | 'mutationKey' | 'retry' | 'networkMode'
> & {
  optimistic?: OptimisticUpdate<TVars>[]
  /** Extra queries to refetch when the mutation settles. */
  invalidates?: Resolvable<[TData | undefined, TVars], QueryKey[]>
  errorMessage?: false | Resolvable<[Error, TVars], string>
  successMessage?: Resolvable<[TData, TVars], string>
  onSuccess?: (data: TData, vars: TVars) => void | Promise<void>
  onError?: (error: Error, vars: TVars) => void
}

const DEFAULT_ERROR = 'Something went wrong. Please try again.'

/* ---------- the hook ---------- */

export function useAppMutation<TData, TVars = void>(
  options: AppMutationOptions<TData, TVars>,
) {
  const queryClient = useQueryClient()
  const {
    optimistic: optimisticUpdates = [],
    invalidates,
    errorMessage,
    successMessage,
    onSuccess,
    onError,
    ...mutationOptions
  } = options

  return useMutation<TData, Error, TVars, Snapshot>({
    ...mutationOptions,

    onMutate: async (vars) => {
      const snapshot: Snapshot = []
      for (const { queryKey, update } of optimisticUpdates) {
        // Stop in-flight refetches from overwriting the optimistic value.
        await queryClient.cancelQueries({ queryKey })
        snapshot.push({
          queryKey,
          previous: queryClient.getQueryData(queryKey),
        })
        queryClient.setQueryData(queryKey, (old: unknown) => update(old, vars))
      }
      return snapshot
    },

    onError: (error, vars, snapshot) => {
      // Roll back in reverse order.
      ;[...(snapshot ?? [])].reverse().forEach(({ queryKey, previous }) => {
        queryClient.setQueryData(queryKey, previous)
      })

      console.error(error)
      if (errorMessage !== false) {
        toast.add({
          type: 'error',
          description: resolve(errorMessage, error, vars) ?? DEFAULT_ERROR,
        })
      }
      onError?.(error, vars)
    },

    onSuccess: async (data, vars) => {
      const message = resolve(successMessage, data, vars)
      if (message) toast.add({ type: 'success', description: message })
      await onSuccess?.(data, vars)
    },

    onSettled: async (data, _error, vars) => {
      // If other mutations with the same key are still running, let the last
      // one refetch. Otherwise a stale refetch flickers the optimistic UI.
      const { mutationKey } = mutationOptions
      if (mutationKey && queryClient.isMutating({ mutationKey }) > 1) return

      const keys = [
        ...optimisticUpdates.map((o) => o.queryKey),
        ...(resolve(invalidates, data, vars) ?? []),
      ]
      await Promise.all(
        keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      )
    },
  })
}
