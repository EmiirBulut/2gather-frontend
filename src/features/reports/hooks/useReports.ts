import { useQuery } from '@tanstack/react-query'
import { getSummary, getCategoryReport, getReportItems } from '../api/reportsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'

export function useReportsSummary(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS_SUMMARY(listId),
    queryFn: () => getSummary(listId),
    enabled: Boolean(listId),
  })
}

export function useCategoryReport(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS_CATEGORY(listId),
    queryFn: () => getCategoryReport(listId),
    enabled: Boolean(listId),
  })
}

export function useReportItems(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORT_ITEMS(listId),
    queryFn: () => getReportItems(listId),
    enabled: Boolean(listId),
  })
}
