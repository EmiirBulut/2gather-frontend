import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markPurchased } from '../api/itemsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { ItemDto } from '../types'

interface Variables {
  itemId: string
  listId: string
}

export function useMarkPurchased() {
  const queryClient = useQueryClient()

  return useMutation<ItemDto, ApiError, Variables>({
    mutationFn: ({ itemId }) => markPurchased(itemId),

    // Optimistic update: remove from Pending immediately
    onMutate: async ({ itemId, listId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'Pending') })

      const previous = queryClient.getQueryData<ItemDto[]>(
        QUERY_KEYS.ITEMS(listId, 'Pending')
      )

      queryClient.setQueryData<ItemDto[]>(
        QUERY_KEYS.ITEMS(listId, 'Pending'),
        (old) => old?.filter((item) => item.id !== itemId) ?? []
      )

      return { previous, listId }
    },

    onError: (_err, _vars, context) => {
      // Roll back on failure
      const ctx = context as { previous: ItemDto[] | undefined; listId: string } | undefined
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.ITEMS(ctx.listId, 'Pending'), ctx.previous)
      }
    },

    onSettled: (_data, _err, { listId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'Pending') })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'Purchased') })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'All') })
    },
  })
}
