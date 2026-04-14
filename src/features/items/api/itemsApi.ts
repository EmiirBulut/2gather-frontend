import { apiClient } from '@/services/api'
import { getCategories } from '@/features/categories/api/categoriesApi'
import type { BackendItemDto, CreateItemRequest, ItemDto, StatusFilter } from '../types'

// ─── Adapter ─────────────────────────────────────────────────────────────────

function toItemDto(raw: BackendItemDto, categoryMap: Map<string, string>): ItemDto {
  return {
    id: raw.id,
    listId: raw.listId,
    categoryId: raw.categoryId,
    categoryName: categoryMap.get(raw.categoryId) ?? raw.categoryId,
    name: raw.name,
    status: raw.status === 0 ? 'Pending' : 'Purchased',
    purchasedAt: raw.purchasedAt,
    optionsCount: raw.optionsCount,
    createdAt: raw.createdAt,
  }
}

// ─── Items API Functions ──────────────────────────────────────────────────────

export async function getItems(
  listId: string,
  status: StatusFilter
): Promise<ItemDto[]> {
  const params = status !== 'All' ? { status } : {}
  const [itemsResponse, categories] = await Promise.all([
    apiClient.get<BackendItemDto[]>(`/api/lists/${listId}/items`, { params }),
    getCategories(listId),
  ])
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))
  return itemsResponse.data.map((item) => toItemDto(item, categoryMap))
}

export async function createItem(data: CreateItemRequest): Promise<ItemDto> {
  const [itemResponse, categories] = await Promise.all([
    apiClient.post<BackendItemDto>(`/api/lists/${data.listId}/items`, data),
    getCategories(data.listId),
  ])
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))
  return toItemDto(itemResponse.data, categoryMap)
}

export async function markPurchased(itemId: string): Promise<void> {
  await apiClient.patch(`/api/items/${itemId}/status`, { status: 1 })
}

export async function deleteItem(itemId: string): Promise<void> {
  await apiClient.delete(`/api/items/${itemId}`)
}
