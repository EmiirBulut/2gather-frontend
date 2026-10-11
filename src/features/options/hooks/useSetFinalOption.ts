import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useInvalidateListData } from '@/hooks/useInvalidateListData'
import { setFinalOption } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'

export function useSetFinalOption(itemId: string) {
  const queryClient = useQueryClient()
  const invalidateListData = useInvalidateListData()

  return useMutation<void, ApiError, string>({
    mutationFn: setFinalOption,
    onSuccess: () => {
      invalidateListData()
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
