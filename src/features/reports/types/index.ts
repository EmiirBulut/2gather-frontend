// ─── Reports Feature Types ────────────────────────────────────────────────────

import type { MemberAvatarDto } from '@/features/lists/types'

// Shape returned by GET /api/lists/:id/reports/summary
export interface ListSummaryReport {
  totalItems: number
  pendingCount: number
  purchasedCount: number
  totalSpent: number
  estimatedTotal: number
}

// Backend returns status as integer: 0 = Pending, 1 = Purchased
export type BackendReportItemStatus = 0 | 1

// Shape returned by GET /api/lists/:id/reports/items — mirrors backend ReportItemDto.
// estimatedPrice follows the shared rule: final > selected > most expensive option.
export interface BackendReportItemDto {
  id: string
  imageUrl: string | null
  name: string
  selectedOptionTitle: string | null
  categoryId: string
  categoryName: string
  estimatedPrice: number | null
  currency: string | null
  status: BackendReportItemStatus
  purchasedAt: string | null
  optionsCount: number
  purchasers: MemberAvatarDto[]
}

export interface ReportItemDto extends Omit<BackendReportItemDto, 'status'> {
  status: 'Pending' | 'Purchased'
}

// Computed client-side from items — no backend endpoint for this
export interface CategoryReport {
  categoryId: string
  categoryName: string
  totalItems: number
  pendingCount: number
  purchasedCount: number
}
