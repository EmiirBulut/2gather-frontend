// ─── Categories Feature Types ─────────────────────────────────────────────────

export interface CategoryDto {
  id: string
  listId: string
  name: string
  itemCount: number
}

export interface CreateCategoryRequest {
  name: string
}
