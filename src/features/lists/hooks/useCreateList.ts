import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createList } from '../api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { CreateListRequest, ListSummaryDto } from '../types'

export function useCreateList() {
  const queryClient = useQueryClient()

  return useMutation<ListSummaryDto, ApiError, CreateListRequest>({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LISTS })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
