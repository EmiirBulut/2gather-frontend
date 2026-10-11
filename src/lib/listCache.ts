import type { QueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/queryKeys'

/**
 * Data derived from a list's items and options: item cards (option counts, prices),
 * dashboard totals and reports. Refresh it after anything that changes items or options.
 */
export function invalidateListAggregates(queryClient: QueryClient, listId: string): void {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS_BY_LIST(listId) })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIST_DETAIL(listId) })
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS(listId) })
}
