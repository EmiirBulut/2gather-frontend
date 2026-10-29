import { useMutation, useQueryClient } from '@tanstack/react-query'
import { renameList } from '../api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { RenameListRequest } from '../types'

export function useRenameList(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, RenameListRequest>({
    mutationFn: async (data) => {
      try {
        await renameList(listId, data)
      } catch (error) {
        throw normalizeError(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIST_DETAIL(listId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LISTS, exact: true })
    },
  })
}
