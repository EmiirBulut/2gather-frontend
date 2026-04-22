// ─── Members Feature Types ────────────────────────────────────────────────────

export type MemberRole = 'Owner' | 'Editor' | 'Viewer'

export interface PendingInviteDto {
  inviteId: string
  invitedEmail: string
  role: MemberRole
  expiresAt: string
  createdAt: string
  isExpired: boolean
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
