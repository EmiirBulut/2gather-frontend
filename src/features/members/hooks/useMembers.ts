import { useQuery } from '@tanstack/react-query'
import { getMembers } from '../api/membersApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useMembers(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS(listId),
    queryFn: () => getMembers(listId),
    enabled: Boolean(listId),
  })
}
