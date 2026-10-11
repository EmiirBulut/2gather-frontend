import { useMutation, useQueryClient } from '@tanstack/react-query'
import { undoPurchase } from '../api/itemsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ApiError } from '@/services/api'

interface Variables {
  itemId: string
  listId: string
}

export function useUndoPurchase() {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, Variables>({
    mutationFn: ({ itemId }) => undoPurchase(itemId),
    onSuccess: (_data, { itemId, listId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEM_DETAIL(itemId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS_BY_LIST(listId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIST_DETAIL(listId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS(listId) })
    },
  })
}
