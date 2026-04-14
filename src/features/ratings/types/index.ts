// ─── Ratings Feature Types ────────────────────────────────────────────────────

export interface OptionRatingSummary {
  averageRating: number | null
  totalRatings: number
  currentUserScore: number | null
}

export interface RateOptionRequest {
  score: number // 1–5
}
