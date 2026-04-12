import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOption } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { ItemOptionDto, UpdateOptionRequest } from '../types'

interface Variables {
  id: string
  data: UpdateOptionRequest
}

export function useUpdateOption(itemId: string) {
  const queryClient = useQueryClient()

  return useMutation<ItemOptionDto, ApiError, Variables>({
    mutationFn: ({ id, data }) => updateOption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
