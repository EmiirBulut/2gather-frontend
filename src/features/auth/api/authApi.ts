import { apiClient } from '@/services/api'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types'

// ─── Auth API Functions ───────────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/register', data)
  return response.data
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/login', data)
  return response.data
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/refresh', {
    refreshToken: token,
  })
  return response.data
}

export async function acceptInvite(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/api/auth/invite/accept', {
    token,
  })
  return response.data
}
