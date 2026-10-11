// ─── Query Key Constants ───────────────────────────────────────────────────────
// All TanStack Query keys live here — never inline strings in hooks.

export const QUERY_KEYS = {
  // Lists
  LISTS: ['lists'] as const,
  LIST_DETAIL: (id: string) => ['lists', id] as const,

  // Items
  ITEMS: (listId: string, status: string) => ['items', listId, status] as const,
  ITEM_DETAIL: (itemId: string) => ['item', itemId] as const,

  // Options
  OPTIONS: (itemId: string) => ['options', itemId] as const,

  // Members
  MEMBERS: (listId: string) => ['members', listId] as const,

  // Categories
  CATEGORIES: (listId: string) => ['categories', listId] as const,

  // Reports
  // Scoped under listId so REPORTS(listId) invalidates every report of a list
  REPORTS: (listId: string) => ['reports', listId] as const,
  REPORTS_SUMMARY: (listId: string) => ['reports', listId, 'summary'] as const,
  REPORTS_CATEGORY: (listId: string) => ['reports', listId, 'category'] as const,
  REPORT_ITEMS: (listId: string) => ['reports', listId, 'items'] as const,

  // Ratings
  RATINGS: (optionId: string) => ['ratings', optionId] as const,

  // Claims
  CLAIMS: (optionId: string) => ['claims', optionId] as const,

  // Pending invites
  PENDING_INVITES: (listId: string) => ['pendingInvites', listId] as const,
} as const
