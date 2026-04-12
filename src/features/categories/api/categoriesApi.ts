import { apiClient } from '@/services/api'
import type { CategoryDto, CreateCategoryRequest } from '../types'

export async function getCategories(listId: string): Promise<CategoryDto[]> {
  const response = await apiClient.get<CategoryDto[]>(`/api/lists/${listId}/categories`)
  return response.data
}

export async function createCategory(
  listId: string,
  data: CreateCategoryRequest
): Promise<CategoryDto> {
  const response = await apiClient.post<CategoryDto>(
    `/api/lists/${listId}/categories`,
    data
  )
  return response.data
}
