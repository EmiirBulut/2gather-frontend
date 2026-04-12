// ─── Members Feature Types ────────────────────────────────────────────────────

export type MemberRole = 'Owner' | 'Editor' | 'Viewer'

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
