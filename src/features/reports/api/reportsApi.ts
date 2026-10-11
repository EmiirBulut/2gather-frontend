import { apiClient } from '@/services/api'
import { getItems } from '@/features/items/api/itemsApi'
import type { BackendReportItemDto, CategoryReport, ListSummaryReport, ReportItemDto } from '../types'

// ─── Reports API Functions ────────────────────────────────────────────────────

export async function getSummary(listId: string): Promise<ListSummaryReport> {
  const response = await apiClient.get<ListSummaryReport>(
    `/api/lists/${listId}/reports/summary`
  )
  return response.data
}

export async function getReportItems(listId: string): Promise<ReportItemDto[]> {
  const response = await apiClient.get<BackendReportItemDto[]>(
    `/api/lists/${listId}/reports/items`
  )
  return response.data.map((item) => ({
    ...item,
    status: item.status === 0 ? 'Pending' : 'Purchased',
  }))
}

// No backend endpoint for category breakdown — compute from items.
export async function getCategoryReport(listId: string): Promise<CategoryReport[]> {
  const items = await getItems(listId, 'All')

  const map = new Map<string, CategoryReport>()

  for (const item of items) {
    if (!map.has(item.categoryId)) {
      map.set(item.categoryId, {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        totalItems: 0,
        pendingCount: 0,
        purchasedCount: 0,
      })
    }
    const entry = map.get(item.categoryId)!
    entry.totalItems += 1
    if (item.status === 'Purchased') {
      entry.purchasedCount += 1
    } else {
      entry.pendingCount += 1
    }
  }

  return Array.from(map.values())
}
