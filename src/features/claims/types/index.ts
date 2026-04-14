// ─── Claims Feature Types ─────────────────────────────────────────────────────

export type ClaimPercentage = 25 | 50 | 75 | 100

// decision sent to backend: 1=Approved, 2=Rejected
export type ReviewDecision = 1 | 2

export interface CreateClaimRequest {
  optionId: string
  percentage: ClaimPercentage
}

export interface ReviewClaimRequest {
  claimId: string
  decision: ReviewDecision
}
