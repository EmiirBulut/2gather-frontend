// ─── Items Feature Types ──────────────────────────────────────────────────────

export type ItemStatus = 'Pending' | 'Purchased'

export interface ItemDto {
  id: string
  listId: string
  categoryId: string
  categoryName: string
  name: string
  status: ItemStatus
  purchasedAt: string | null
  optionsCount: number
  selectedOptionSummary: {
    title: string
    price: number | null
  } | null
  createdAt: string
}

export interface CreateItemRequest {
  listId: string
  categoryId: string
  name: string
}

export type StatusFilter = 'Pending' | 'Purchased' | 'All'
