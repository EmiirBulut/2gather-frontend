import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOption } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { CreateOptionRequest, ItemOptionDto } from '../types'

export function useCreateOption(itemId: string) {
  const queryClient = useQueryClient()

  return useMutation<ItemOptionDto, ApiError, CreateOptionRequest>({
    mutationFn: createOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
