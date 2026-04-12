import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categoriesApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useCategories(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES(listId),
    queryFn: () => getCategories(listId),
    enabled: Boolean(listId),
  })
}
