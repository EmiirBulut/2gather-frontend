import { apiClient } from '@/services/api'
import type { CreateOptionRequest, ItemOptionDto, UpdateOptionRequest } from '../types'

// ─── Options API Functions ────────────────────────────────────────────────────

export async function getOptions(itemId: string): Promise<ItemOptionDto[]> {
  const response = await apiClient.get<ItemOptionDto[]>(`/api/items/${itemId}/options`)
  return response.data
}

export async function createOption(data: CreateOptionRequest): Promise<ItemOptionDto> {
  const response = await apiClient.post<ItemOptionDto>(
    `/api/items/${data.itemId}/options`,
    data
  )
  return response.data
}

export async function updateOption(
  id: string,
  data: UpdateOptionRequest
): Promise<ItemOptionDto> {
  const response = await apiClient.put<ItemOptionDto>(`/api/options/${id}`, data)
  return response.data
}

export async function selectOption(id: string): Promise<ItemOptionDto> {
  const response = await apiClient.patch<ItemOptionDto>(`/api/options/${id}/select`)
  return response.data
}

export async function deleteOption(id: string): Promise<void> {
  await apiClient.delete(`/api/options/${id}`)
}

export async function setFinalOption(optionId: string): Promise<void> {
  await apiClient.patch(`/api/options/${optionId}/finalize`)
}

export async function removeFinalDecision(optionId: string): Promise<void> {
  await apiClient.delete(`/api/options/${optionId}/finalize`)
}
