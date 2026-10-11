import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useInvalidateListData } from '@/hooks/useInvalidateListData'
import { selectOption } from '../api/optionsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { ItemOptionDto } from '../types'

export function useSelectOption(itemId: string) {
  const queryClient = useQueryClient()
  const invalidateListData = useInvalidateListData()

  return useMutation<ItemOptionDto, ApiError, string>({
    mutationFn: selectOption,
    onSuccess: (updatedOption) => {
      invalidateListData()
      // Update cache directly: mark selected, deselect others
      queryClient.setQueryData<ItemOptionDto[]>(
        QUERY_KEYS.OPTIONS(itemId),
        (old) =>
          old?.map((opt) => ({
            ...opt,
            isSelected: opt.id === updatedOption.id,
          })) ?? []
      )
    },
    onError: (error: unknown) => normalizeError(error),
  })
}
