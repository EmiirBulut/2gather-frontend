import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '../api/categoriesApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { invalidateListAggregates } from '@/lib/listCache'
import type { ApiError } from '@/services/api'
import type { CategoryDto } from '../types'

export function useDeleteCategory(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, string>({
    mutationFn: deleteCategory,
    onSuccess: (_data, categoryId) => {
      queryClient.setQueryData<CategoryDto[]>(
        QUERY_KEYS.CATEGORIES(listId),
        (old) => old?.filter((c) => c.id !== categoryId)
      )
      // Its items were deleted too
      invalidateListAggregates(queryClient, listId)
    },
  })
}
