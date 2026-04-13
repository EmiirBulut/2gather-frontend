import { apiClient } from '@/services/api'
import type { InviteRequest } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InviteResponse {
  inviteId: string
  invitedEmail: string
  token: string
  expiresAt: string
}

// ─── Members API Functions ────────────────────────────────────────────────────

// Members are embedded in GET /api/lists/:id — see useListDetail.
// Only invite is available as a write operation on the current backend.

export async function inviteMember(
  listId: string,
  data: InviteRequest
): Promise<InviteResponse> {
  const response = await apiClient.post<InviteResponse>(
    `/api/lists/${listId}/members/invite`,
    data
  )
  return response.data
}
