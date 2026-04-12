import { apiClient } from '@/services/api'
import type { CreateListRequest, ListSummaryDto } from '../types'

// ─── Lists API Functions ──────────────────────────────────────────────────────

export async function getLists(): Promise<ListSummaryDto[]> {
  const response = await apiClient.get<ListSummaryDto[]>('/api/lists')
  return response.data
}

export async function createList(data: CreateListRequest): Promise<ListSummaryDto> {
  const response = await apiClient.post<ListSummaryDto>('/api/lists', data)
  return response.data
}

export async function deleteList(id: string): Promise<void> {
  await apiClient.delete(`/api/lists/${id}`)
}
