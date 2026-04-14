// ─── Query Key Constants ───────────────────────────────────────────────────────
// All TanStack Query keys live here — never inline strings in hooks.

export const QUERY_KEYS = {
  // Lists
  LISTS: ['lists'] as const,
  LIST_DETAIL: (id: string) => ['lists', id] as const,

  // Items
  ITEMS: (listId: string, status: string) => ['items', listId, status] as const,

  // Options
  OPTIONS: (itemId: string) => ['options', itemId] as const,

  // Members
  MEMBERS: (listId: string) => ['members', listId] as const,

  // Categories
  CATEGORIES: (listId: string) => ['categories', listId] as const,

  // Reports
  REPORTS_SUMMARY: (listId: string) => ['reports', 'summary', listId] as const,
  REPORTS_CATEGORY: (listId: string) => ['reports', 'category', listId] as const,

  // Ratings
  RATINGS: (optionId: string) => ['ratings', optionId] as const,
} as const
