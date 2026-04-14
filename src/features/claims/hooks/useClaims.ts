import { useQuery } from '@tanstack/react-query'
import { getClaimsByOption } from '../api/claimsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useClaims(optionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CLAIMS(optionId),
    queryFn: () => getClaimsByOption(optionId),
    enabled: !!optionId,
  })
}
