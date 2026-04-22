import { apiClient } from '@/services/api'
import type { InviteMemberRequest, PendingInviteDto } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InviteResponse {
  inviteId: string
  invitedEmail: string
  token: string
  expiresAt: string
}

// ─── Members API Functions ────────────────────────────────────────────────────

export async function inviteMember(
  listId: string,
  data: InviteMemberRequest
): Promise<void> {
  await apiClient.post(`/api/lists/${listId}/members/invite`, data)
}

export async function getPendingInvites(listId: string): Promise<PendingInviteDto[]> {
  const response = await apiClient.get<PendingInviteDto[]>(
    `/api/lists/${listId}/members/invites`
  )
  return response.data
}

export async function cancelInvite(listId: string, inviteId: string): Promise<void> {
  await apiClient.delete(`/api/lists/${listId}/members/invites/${inviteId}`)
}

export async function resendInvite(listId: string, inviteId: string): Promise<void> {
  await apiClient.post(`/api/lists/${listId}/members/invites/${inviteId}/resend`)
}
