import { useQuery } from '@tanstack/react-query'
import { getLists } from '../api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useLists() {
  return useQuery({
    queryKey: QUERY_KEYS.LISTS,
    queryFn: getLists,
  })
}
