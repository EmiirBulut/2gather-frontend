import { useQuery } from '@tanstack/react-query'
import { getItemDetail } from '../api/itemsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useItemDetail(itemId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ITEM_DETAIL(itemId),
    queryFn: () => getItemDetail(itemId),
    enabled: Boolean(itemId),
  })
}
