// ─── Members Feature Types ────────────────────────────────────────────────────

export type MemberRole = 'Owner' | 'Editor' | 'Viewer'

// Backend returns email status as integer — see InviteEmailStatus enum
export type BackendInviteEmailStatus = 0 | 1 | 2 | 3 | 4 | 5

export type InviteEmailStatus = 'Pending' | 'Sent' | 'Failed' | 'Delivered' | 'Bounced' | 'Complained'

// GET /api/lists/:listId/members/invites — mirrors backend PendingInviteDto
export interface BackendPendingInviteDto {
  inviteId: string
  invitedEmail: string
  role: BackendMemberRole
  expiresAt: string
  createdAt: string
  isExpired: boolean
  emailStatus: BackendInviteEmailStatus
  lastSentAt: string | null
  sendCount: number
  deliveredAt: string | null
}

export interface PendingInviteDto extends Omit<BackendPendingInviteDto, 'role' | 'emailStatus'> {
  role: MemberRole
  emailStatus: InviteEmailStatus
}

export interface InviteMemberRequest {
  email: string
  role: 'Editor' | 'Viewer'
}

// Backend returns role as integer: 0 = Owner, 1 = Editor, 2 = Viewer
export type BackendMemberRole = 0 | 1 | 2

export interface BackendMemberDto {
  userId: string
  displayName: string
  email: string
  role: BackendMemberRole
  joinedAt: string
}

export interface MemberDto {
  userId: string
  displayName: string
  email: string
  role: MemberRole
  joinedAt: string
}

export interface InviteRequest {
  email: string
  role: 'Editor' | 'Viewer'
}

export interface UpdateMemberRoleRequest {
  role: 'Editor' | 'Viewer'
}
