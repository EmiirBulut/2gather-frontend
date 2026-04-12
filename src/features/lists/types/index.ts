// ─── Lists Feature Types ──────────────────────────────────────────────────────

import type { BackendMemberDto, MemberDto } from '@/features/members/types'

export interface ListSummaryDto {
  id: string
  name: string
  ownerId: string
  memberCount: number
  createdAt: string
}

// GET /api/lists/:id returns full detail with embedded members
export interface ListDetailDto {
  id: string
  name: string
  ownerId: string
  createdAt: string
  members: BackendMemberDto[]
}

// Normalized list detail with string roles
export interface ListDetailNormalized {
  id: string
  name: string
  ownerId: string
  createdAt: string
  members: MemberDto[]
}

export interface CreateListRequest {
  name: string
}
