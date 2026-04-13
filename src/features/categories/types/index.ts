// ─── Categories Feature Types ─────────────────────────────────────────────────

export interface CategoryDto {
  id: string
  listId: string | null
  name: string
  roomLabel: string
  isSystem: boolean
}

export interface CreateCategoryRequest {
  name: string
  roomLabel: string
}
