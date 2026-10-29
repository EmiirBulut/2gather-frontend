import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem } from '../api/itemsApi'
import { invalidateListAggregates } from '@/lib/listCache'
import { normalizeError, type ApiError } from '@/services/api'
import type { CreateItemRequest, ItemDto } from '../types'

export function useCreateItem(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<ItemDto, ApiError, CreateItemRequest>({
    mutationFn: createItem,
    onSuccess: () => invalidateListAggregates(queryClient, listId),
    onError: (error: unknown) => normalizeError(error),
  })
}
