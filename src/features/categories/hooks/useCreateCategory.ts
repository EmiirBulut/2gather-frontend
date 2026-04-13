import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../api/categoriesApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ApiError } from '@/services/api'
import type { CategoryDto, CreateCategoryRequest } from '../types'

interface Variables {
  listId: string
  data: CreateCategoryRequest
}

export function useCreateCategory(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<CategoryDto, ApiError, Variables>({
    mutationFn: ({ listId: id, data }) => createCategory(id, data),
    onSuccess: (newCategory) => {
      queryClient.setQueryData<CategoryDto[]>(
        QUERY_KEYS.CATEGORIES(listId),
        (old) => (old ? [...old, newCategory] : [newCategory])
      )
    },
  })
}
