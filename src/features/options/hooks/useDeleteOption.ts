import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useInvalidateListData } from '@/hooks/useInvalidateListData'
import { deleteOption } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'

export function useDeleteOption(itemId: string) {
  const queryClient = useQueryClient()
  const invalidateListData = useInvalidateListData()

  return useMutation<void, ApiError, string>({
    mutationFn: deleteOption,
    onSuccess: (_data, deletedId) => {
      invalidateListData()
      // Remove from cache directly
      queryClient.setQueryData(
        QUERY_KEYS.OPTIONS(itemId),
        (old: { id: string }[] | undefined) =>
          old?.filter((opt) => opt.id !== deletedId) ?? []
      )
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
