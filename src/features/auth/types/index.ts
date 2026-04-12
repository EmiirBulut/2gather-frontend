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

// Shape returned by the backend (flat)
export interface BackendAuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
  email: string
  displayName: string
}

// Normalized shape used internally
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
