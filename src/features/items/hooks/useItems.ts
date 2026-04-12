import { useQuery } from '@tanstack/react-query'
import { getItems } from '../api/itemsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { StatusFilter } from '../types'

export function useItems(listId: string, status: StatusFilter) {
  return useQuery({
    queryKey: QUERY_KEYS.ITEMS(listId, status),
    queryFn: () => getItems(listId, status),
    enabled: Boolean(listId),
  })
}
