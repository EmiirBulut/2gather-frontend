// ─── Lists Feature Types ──────────────────────────────────────────────────────

export interface ListSummaryDto {
  id: string
  name: string
  ownerId: string
  memberCount: number
  createdAt: string
}

export interface CreateListRequest {
  name: string
}
