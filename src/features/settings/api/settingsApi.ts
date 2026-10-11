import { apiClient } from '@/services/api'
import type { ChangePasswordRequest, UpdateProfileRequest, UserProfileDto } from '../types'

// ─── Settings API Functions ───────────────────────────────────────────────────

export async function getCurrentUser(): Promise<UserProfileDto> {
  const response = await apiClient.get<UserProfileDto>('/api/users/me')
  return response.data
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfileDto> {
  const response = await apiClient.put<UserProfileDto>('/api/users/me', data)
  return response.data
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await apiClient.put('/api/users/me/password', data)
}
