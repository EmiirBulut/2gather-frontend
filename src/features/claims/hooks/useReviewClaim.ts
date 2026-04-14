import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewClaim } from '../api/claimsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { ClaimDto } from '@/features/options/types'
import type { ReviewDecision } from '../types'

interface Variables {
  claimId: string
  optionId: string
  decision: ReviewDecision
}

export function useReviewClaim(itemId: string) {
  const queryClient = useQueryClient()

  return useMutation<ClaimDto, ApiError, Variables>({
    mutationFn: ({ claimId, decision }) => reviewClaim(claimId, decision),
    onSuccess: (_data, { optionId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLAIMS(optionId) })
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
