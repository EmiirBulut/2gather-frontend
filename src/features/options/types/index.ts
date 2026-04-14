// ─── Options Feature Types ────────────────────────────────────────────────────

export interface ClaimDto {
  id: string
  optionId: string
  userId: string
  displayName: string
  percentage: number
  status: 'Pending' | 'Approved' | 'Rejected'
  createdAt: string
}

export interface ItemOptionDto {
  id: string
  itemId: string
  title: string
  price: number | null
  currency: string | null
  link: string | null
  notes: string | null
  isSelected: boolean
  createdAt: string
  brand: string | null
  model: string | null
  color: string | null
  averageRating: number | null
  totalRatings: number
  currentUserScore: number | null
  isFinal: boolean
  finalizedAt: string | null
  approvedClaimsTotal: number
  remainingClaimPercentage: number
  claims: ClaimDto[]
}

export interface CreateOptionRequest {
  itemId: string
  title: string
  price?: number
  currency?: string
  link?: string
  notes?: string
}

export interface UpdateOptionRequest {
  title?: string
  price?: number
  currency?: string
  link?: string
  notes?: string
}
