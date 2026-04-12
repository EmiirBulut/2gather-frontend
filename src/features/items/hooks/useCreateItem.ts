import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem } from '../api/itemsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { CreateItemRequest, ItemDto } from '../types'

export function useCreateItem(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<ItemDto, ApiError, CreateItemRequest>({
    mutationFn: createItem,
    onSuccess: () => {
      // Invalidate both Pending and All views
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'Pending') })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'All') })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
