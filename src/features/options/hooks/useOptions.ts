import { useQuery } from '@tanstack/react-query'
import { getOptions } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useOptions(itemId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.OPTIONS(itemId),
    queryFn: () => getOptions(itemId),
    enabled: Boolean(itemId),
  })
}
