import { apiClient } from '@/services/api'
import type { CreateItemRequest, ItemDto, StatusFilter } from '../types'

// ─── Items API Functions ──────────────────────────────────────────────────────

export async function getItems(
  listId: string,
  status: StatusFilter
): Promise<ItemDto[]> {
  const params = status !== 'All' ? { status } : {}
  const response = await apiClient.get<ItemDto[]>(`/api/lists/${listId}/items`, { params })
  return response.data
}

export async function createItem(data: CreateItemRequest): Promise<ItemDto> {
  const response = await apiClient.post<ItemDto>(
    `/api/lists/${data.listId}/items`,
    data
  )
  return response.data
}

export async function markPurchased(itemId: string): Promise<ItemDto> {
  const response = await apiClient.patch<ItemDto>(`/api/items/${itemId}/purchased`)
  return response.data
}

export async function deleteItem(itemId: string): Promise<void> {
  await apiClient.delete(`/api/items/${itemId}`)
}
