import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rateOption } from '../api/ratingsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import type { OptionRatingSummary } from '../types'
import type { ItemOptionDto } from '@/features/options/types'

interface Variables {
  optionId: string
  score: number
}

interface Context {
  previous: ItemOptionDto[] | undefined
}

export function useRateOption(itemId: string) {
  const queryClient = useQueryClient()

  return useMutation<OptionRatingSummary, ApiError, Variables, Context>({
    mutationFn: ({ optionId, score }) => rateOption(optionId, score),

    onMutate: async ({ optionId, score }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.OPTIONS(itemId) })

      const previous = queryClient.getQueryData<ItemOptionDto[]>(
        QUERY_KEYS.OPTIONS(itemId)
      )

      queryClient.setQueryData<ItemOptionDto[]>(
        QUERY_KEYS.OPTIONS(itemId),
        (old) =>
          old?.map((opt) =>
            opt.id === optionId
              ? { ...opt, currentUserScore: score }
              : opt
          ) ?? []
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.OPTIONS(itemId), context.previous)
      }
      normalizeError(_err)
    },

    onSuccess: (summary, { optionId }) => {
      queryClient.setQueryData<ItemOptionDto[]>(
        QUERY_KEYS.OPTIONS(itemId),
        (old) =>
          old?.map((opt) =>
            opt.id === optionId
              ? {
                  ...opt,
                  averageRating: summary.averageRating,
                  totalRatings: summary.totalRatings,
                  currentUserScore: summary.currentUserScore,
                }
              : opt
          ) ?? []
      )
    },
  })
}
