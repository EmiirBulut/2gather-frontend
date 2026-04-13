// ─── Reports Feature Types ────────────────────────────────────────────────────

// Shape returned by GET /api/lists/:id/reports/summary
export interface ListSummaryReport {
  totalItems: number
  pendingCount: number
  purchasedCount: number
  totalSpent: number
  estimatedTotal: number
}

// Computed client-side from items — no backend endpoint for this
export interface CategoryReport {
  categoryId: string
  categoryName: string
  totalItems: number
  pendingCount: number
  purchasedCount: number
}
