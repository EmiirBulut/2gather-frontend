import { apiClient } from '@/services/api'
import type { CategoryDto, CreateCategoryRequest } from '../types'

export async function getCategories(listId: string): Promise<CategoryDto[]> {
  const response = await apiClient.get<CategoryDto[]>('/api/categories', {
    params: { listId },
  })
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

export async function updateCategory(
  categoryId: string,
  data: CreateCategoryRequest
): Promise<CategoryDto> {
  const response = await apiClient.put<CategoryDto>(
    `/api/categories/${categoryId}`,
    data
  )
  return response.data
}
