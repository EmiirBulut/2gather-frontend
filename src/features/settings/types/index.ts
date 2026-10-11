// ─── Settings Feature Types ───────────────────────────────────────────────────

// GET/PUT /api/users/me — mirrors backend UserProfileDto
export interface UserProfileDto {
  id: string
  email: string
  displayName: string
}

export interface UpdateProfileRequest {
  displayName: string
  email: string
  currentPassword?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
