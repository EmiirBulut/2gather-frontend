import { apiClient } from '@/services/api'
import type { BackendMemberRole, MemberRole } from '@/features/members/types'
import type { CreateListRequest, ListDetailDto, ListDetailNormalized, ListSummaryDto } from '../types'

// ─── Adapter ─────────────────────────────────────────────────────────────────

const ROLE_MAP: Record<BackendMemberRole, MemberRole> = {
  0: 'Owner',
  1: 'Editor',
  2: 'Viewer',
}

function normalizeListDetail(raw: ListDetailDto): ListDetailNormalized {
  return {
    ...raw,
    members: raw.members.map((m) => ({
      ...m,
      role: ROLE_MAP[m.role],
    })),
  }
}

// ─── Lists API Functions ──────────────────────────────────────────────────────

export async function getLists(): Promise<ListSummaryDto[]> {
  const response = await apiClient.get<ListSummaryDto[]>('/api/lists')
  return response.data
}

export async function getListDetail(id: string): Promise<ListDetailNormalized> {
  const response = await apiClient.get<ListDetailDto>(`/api/lists/${id}`)
  return normalizeListDetail(response.data)
}

export async function createList(data: CreateListRequest): Promise<ListSummaryDto> {
  const response = await apiClient.post<ListSummaryDto>('/api/lists', data)
  return response.data
}

export async function deleteList(id: string): Promise<void> {
  await apiClient.delete(`/api/lists/${id}`)
}
