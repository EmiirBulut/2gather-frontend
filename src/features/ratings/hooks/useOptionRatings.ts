import { useQuery } from '@tanstack/react-query'
import { getOptionRatings } from '../api/ratingsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useOptionRatings(optionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RATINGS(optionId),
    queryFn: () => getOptionRatings(optionId),
    enabled: !!optionId,
  })
}
