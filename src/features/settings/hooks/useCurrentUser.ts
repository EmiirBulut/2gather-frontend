import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/settingsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: getCurrentUser,
  })
}
