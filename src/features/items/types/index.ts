// ─── Items Feature Types ──────────────────────────────────────────────────────

import type { MemberAvatarDto } from '@/features/lists/types'
import type { ItemOptionDto } from '@/features/options/types'

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

// GET /api/items/:itemId — mirrors backend ItemDetailDto
export interface BackendItemDetailDto {
  id: string
  name: string
  imageUrl: string | null
  planningNote: string | null
  status: BackendItemStatus
  purchasedAt: string | null
  createdAt: string
  updatedAt: string
  categoryId: string
  categoryName: string
  roomLabel: string
  assignedTo: MemberAvatarDto | null
  options: ItemOptionDto[]
}

export interface ItemDetailDto extends Omit<BackendItemDetailDto, 'status'> {
  status: ItemStatus
}

export interface CreateItemRequest {
  listId: string
  categoryId: string
  name: string
}

export type StatusFilter = 'Pending' | 'Purchased' | 'All'
