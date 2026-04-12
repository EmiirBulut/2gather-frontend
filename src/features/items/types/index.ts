// ─── Items Feature Types ──────────────────────────────────────────────────────

export type ItemStatus = 'Pending' | 'Purchased'

// Backend returns status as integer: 0 = Pending, 1 = Purchased
export type BackendItemStatus = 0 | 1

export interface BackendItemDto {
  id: string
  listId: string
  categoryId: string
  name: string
  status: BackendItemStatus
  purchasedAt: string | null
  optionsCount: number
  createdAt: string
}

export interface ItemDto {
  id: string
  listId: string
  categoryId: string
  categoryName: string
  name: string
  status: ItemStatus
  purchasedAt: string | null
  optionsCount: number
  createdAt: string
}

export interface CreateItemRequest {
  listId: string
  categoryId: string
  name: string
}

export type StatusFilter = 'Pending' | 'Purchased' | 'All'
