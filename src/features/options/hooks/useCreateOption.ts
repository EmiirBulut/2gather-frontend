import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useInvalidateListData } from '@/hooks/useInvalidateListData'
import { createOption } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { CreateOptionRequest, ItemOptionDto } from '../types'

export function useCreateOption(itemId: string) {
  const queryClient = useQueryClient()
  const invalidateListData = useInvalidateListData()

  return useMutation<ItemOptionDto, ApiError, CreateOptionRequest>({
    mutationFn: createOption,
    onSuccess: () => {
      invalidateListData()
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
