import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteList } from '../api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'

export function useDeleteList() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: async (listId) => {
      try {
        await deleteList(listId)
      } catch (error) {
        throw normalizeError(error)
      }
    },
    onSuccess: (_data, listId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.LIST_DETAIL(listId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LISTS, exact: true })
    },
  })
}
