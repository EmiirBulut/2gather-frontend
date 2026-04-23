import { useQuery } from '@tanstack/react-query'
import { getMembers } from '../api/membersApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { MemberDto } from '../types'

export function useMembers(listId: string): { data: MemberDto[] | undefined; isLoading: boolean; isError: boolean } {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBERS(listId),
    queryFn: () => getMembers(listId),
    enabled: Boolean(listId),
  })
}
