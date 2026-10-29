import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadItemImage } from '../api/itemsApi'
import { compressImage } from '@/lib/images'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { invalidateListAggregates } from '@/lib/listCache'
import { normalizeError, type ApiError } from '@/services/api'
import type { UploadItemImageResponse } from '../types'

interface Variables {
  itemId: string
  file: File
}

export function useUploadItemImage(listId: string) {
  const queryClient = useQueryClient()

  return useMutation<UploadItemImageResponse, ApiError, Variables>({
    mutationFn: async ({ itemId, file }) => {
      try {
        return await uploadItemImage(itemId, await compressImage(file))
      } catch (error) {
        throw normalizeError(error)
      }
    },
    onSuccess: (_data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEM_DETAIL(itemId) })
      invalidateListAggregates(queryClient, listId)
    },
  })
}
