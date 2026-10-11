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
  imageUrl: string | null
  planningNote: string | null
  optionsCount: number
  createdAt: string
  updatedAt: string
  // final > selected > most expensive option; null when no option has a price
  effectivePrice: number | null
}

export interface ItemDto {
  id: string
  listId: string
  categoryId: string
  categoryName: string
  name: string
  status: ItemStatus
  purchasedAt: string | null
  imageUrl: string | null
  planningNote: string | null
  optionsCount: number
  createdAt: string
  updatedAt: string
  effectivePrice: number | null
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
  purchasers: MemberAvatarDto[]
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

// POST /api/items/:itemId/image
export interface UploadItemImageResponse {
  imageUrl: string
}

export interface MarkPurchasedRequest {
  purchaserUserIds: string[]
}

export type StatusFilter = 'Pending' | 'Purchased' | 'All'
