import { apiClient } from '@/services/api'
import type { InviteRequest, MemberDto } from '../types'

export async function getMembers(listId: string): Promise<MemberDto[]> {
  const response = await apiClient.get<MemberDto[]>(`/api/lists/${listId}/members`)
  return response.data
}

export async function inviteMember(listId: string, data: InviteRequest): Promise<void> {
  await apiClient.post(`/api/lists/${listId}/members/invite`, data)
}

export async function removeMember(listId: string, userId: string): Promise<void> {
  await apiClient.delete(`/api/lists/${listId}/members/${userId}`)
}

export async function updateMemberRole(
  listId: string,
  userId: string,
  role: 'Editor' | 'Viewer'
): Promise<MemberDto> {
  const response = await apiClient.patch<MemberDto>(
    `/api/lists/${listId}/members/${userId}/role`,
    { role }
  )
  return response.data
}
