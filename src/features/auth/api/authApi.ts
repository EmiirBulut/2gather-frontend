import { apiClient } from '@/services/api'
import type {
  AuthResponse,
  BackendAuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'

// ─── Adapter ─────────────────────────────────────────────────────────────────

function toAuthResponse(raw: BackendAuthResponse): AuthResponse {
  return {
    accessToken: raw.accessToken,
    refreshToken: raw.refreshToken,
    user: { id: raw.userId, email: raw.email, displayName: raw.displayName },
  }
}

// ─── Auth API Functions ───────────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>('/api/auth/register', data)
  return toAuthResponse(response.data)
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>('/api/auth/login', data)
  return toAuthResponse(response.data)
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>('/api/auth/refresh', {
    refreshToken: token,
  })
  return toAuthResponse(response.data)
}

export async function acceptInvite(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<BackendAuthResponse>('/api/auth/invite/accept', {
    token,
  })
  return toAuthResponse(response.data)
}
