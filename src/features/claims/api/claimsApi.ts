import { apiClient } from '@/services/api'
import type { ClaimDto } from '@/features/options/types'
import type { ClaimPercentage, ReviewDecision } from '../types'

export async function createClaim(
  optionId: string,
  percentage: ClaimPercentage
): Promise<ClaimDto> {
  const response = await apiClient.post<ClaimDto>(
    `/api/options/${optionId}/claims`,
    { percentage }
  )
  return response.data
}

export async function getClaimsByOption(optionId: string): Promise<ClaimDto[]> {
  const response = await apiClient.get<ClaimDto[]>(`/api/options/${optionId}/claims`)
  return response.data
}

export async function reviewClaim(
  claimId: string,
  decision: ReviewDecision
): Promise<ClaimDto> {
  const response = await apiClient.patch<ClaimDto>(
    `/api/claims/${claimId}/review`,
    { decision }
  )
  return response.data
}
