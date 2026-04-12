// ─── Categories Feature Types ─────────────────────────────────────────────────

export interface CategoryDto {
  id: string
  listId: string
  name: string
  roomLabel: string
}

export interface CreateCategoryRequest {
  name: string
  roomLabel: string
}
