import { useQuery } from '@tanstack/react-query'
import { getListDetail } from '../api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useListDetail(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.LIST_DETAIL(listId),
    queryFn: () => getListDetail(listId),
    enabled: Boolean(listId),
  })
}
