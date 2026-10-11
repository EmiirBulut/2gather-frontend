import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useInvalidateListData } from '@/hooks/useInvalidateListData'
import { removeFinalDecision } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'

export function useRemoveFinalDecision(itemId: string) {
  const queryClient = useQueryClient()
  const invalidateListData = useInvalidateListData()

  return useMutation<void, ApiError, string>({
    mutationFn: removeFinalDecision,
    onSuccess: () => {
      invalidateListData()
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
