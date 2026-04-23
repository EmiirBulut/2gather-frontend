// ─── Lists Feature Types ──────────────────────────────────────────────────────

export interface MemberAvatarDto {
  userId: string
  displayName: string
  initials: string
}

export interface ListSummaryDto {
  id: string
  name: string
  currentUserRole: number  // 0=Owner, 1=Editor, 2=Viewer
  memberCount: number
  totalItemCount: number
  purchasedItemCount: number
  pendingItemCount: number
  completionPercentage: number
  members: MemberAvatarDto[]
  createdAt: string
}

export interface FinancialSummaryDto {
  totalEstimated: number
  totalSpent: number
  remainingBudget: number
}

export interface PendingClaimSummaryDto {
  claimId: string
  itemId: string
  itemName: string
  optionTitle: string
  claimantDisplayName: string
  percentage: number
  createdAt: string
}

export interface CategorySummaryDto {
  categoryId: string
  name: string
  roomLabel: string
  totalItems: number
  purchasedItems: number
  completionPercentage: number
  assignedMembers: MemberAvatarDto[]
}

// GET /api/lists/:id — full list detail
export interface ListDetailDto {
  id: string
  name: string
  currentUserRole: number  // 0=Owner, 1=Editor, 2=Viewer
  completionPercentage: number
  financial: FinancialSummaryDto
  pendingClaims: PendingClaimSummaryDto[]
  categorySummaries: CategorySummaryDto[]
  memberCount: number
  createdAt: string
}

// No role normalization needed — members are not included in list detail
export type ListDetailNormalized = ListDetailDto

export interface CreateListRequest {
  name: string
}
