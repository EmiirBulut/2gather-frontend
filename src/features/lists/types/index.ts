// ─── Lists Feature Types ──────────────────────────────────────────────────────

export interface ListSummaryDto {
  id: string
  name: string
  memberCount: number
  itemCount: number
  pendingCount: number
  createdAt: string
}

export interface CreateListRequest {
  name: string
}
