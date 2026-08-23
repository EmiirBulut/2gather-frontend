import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategory } from '../api/categoriesApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ApiError } from '@/services/api'
import type { CategoryDto, CreateCategoryRequest } from '../types'

interface Variables {
  categoryId: string
  data: CreateCategoryRequest
}

export function useUpdateCategory(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<CategoryDto, ApiError, Variables>({
    mutationFn: ({ categoryId, data }) => updateCategory(categoryId, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<CategoryDto[]>(
        QUERY_KEYS.CATEGORIES(listId),
        (old) => old?.map((c) => (c.id === updated.id ? updated : c))
      )
    },
  })
}
