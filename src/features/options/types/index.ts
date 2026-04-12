// ─── Options Feature Types ────────────────────────────────────────────────────

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
