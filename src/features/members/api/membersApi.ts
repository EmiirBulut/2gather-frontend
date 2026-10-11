import { apiClient } from '@/services/api'
import type {
  BackendInviteEmailStatus,
  BackendMemberDto,
  BackendMemberRole,
  BackendPendingInviteDto,
  InviteEmailStatus,
  InviteMemberRequest,
  MemberDto,
  MemberRole,
  PendingInviteDto,
} from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InviteResponse {
  inviteId: string
  invitedEmail: string
  token: string
  expiresAt: string
}

const ROLE_MAP: Record<BackendMemberRole, MemberRole> = {
  0: 'Owner',
  1: 'Editor',
  2: 'Viewer',
}

const EMAIL_STATUS_MAP: Record<BackendInviteEmailStatus, InviteEmailStatus> = {
  0: 'Pending',
  1: 'Sent',
  2: 'Failed',
  3: 'Delivered',
  4: 'Bounced',
  5: 'Complained',
}

// ─── Members API Functions ────────────────────────────────────────────────────

export async function getMembers(listId: string): Promise<MemberDto[]> {
  const response = await apiClient.get<BackendMemberDto[]>(`/api/lists/${listId}/members`)
  return response.data.map((m) => ({ ...m, role: ROLE_MAP[m.role] }))
}

export async function inviteMember(
  listId: string,
  data: InviteMemberRequest
): Promise<void> {
  await apiClient.post(`/api/lists/${listId}/members/invite`, data)
}

export async function getPendingInvites(listId: string): Promise<PendingInviteDto[]> {
  const response = await apiClient.get<BackendPendingInviteDto[]>(
    `/api/lists/${listId}/members/invites`
  )
  return response.data.map((invite) => ({
    ...invite,
    role: ROLE_MAP[invite.role],
    emailStatus: EMAIL_STATUS_MAP[invite.emailStatus],
  }))
}

export async function cancelInvite(listId: string, inviteId: string): Promise<void> {
  await apiClient.delete(`/api/lists/${listId}/members/invites/${inviteId}`)
}

export async function resendInvite(listId: string, inviteId: string): Promise<void> {
  await apiClient.post(`/api/lists/${listId}/members/invites/${inviteId}/resend`)
}
