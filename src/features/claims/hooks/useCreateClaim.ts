import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClaim } from '../api/claimsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { ClaimDto } from '@/features/options/types'
import type { ClaimPercentage } from '../types'

interface Variables {
  optionId: string
  percentage: ClaimPercentage
}

export function useCreateClaim(itemId: string) {
  const queryClient = useQueryClient()

  return useMutation<ClaimDto, ApiError, Variables>({
    mutationFn: ({ optionId, percentage }) => createClaim(optionId, percentage),
    onSuccess: (_data, { optionId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLAIMS(optionId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
