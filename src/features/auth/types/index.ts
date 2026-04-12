// ─── Auth Feature Types ───────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string
  password: string
  displayName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserDto
}

export interface UserDto {
  id: string
  email: string
  displayName: string
}
