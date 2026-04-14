import { apiClient } from '@/services/api'
import type { OptionRatingSummary } from '../types'

export async function rateOption(
  optionId: string,
  score: number
): Promise<OptionRatingSummary> {
  const response = await apiClient.post<OptionRatingSummary>(
    `/api/options/${optionId}/ratings`,
    { score }
  )
  return response.data
}

export async function getOptionRatings(optionId: string): Promise<OptionRatingSummary> {
  const response = await apiClient.get<OptionRatingSummary>(
    `/api/options/${optionId}/ratings`
  )
  return response.data
}
