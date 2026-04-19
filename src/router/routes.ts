// ─── Route Path Constants ──────────────────────────────────────────────────────
// Never hardcode route strings outside this file.

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  INVITE: '/invite/:token',
  INVITE_WITH_TOKEN: (token: string) => `/invite/${token}`,

  LISTS: '/lists',
  LIST_DETAIL: '/lists/:listId',
  LIST_DETAIL_WITH_ID: (listId: string) => `/lists/${listId}`,

  ITEM_LIST: '/lists/:listId/items',
  ITEM_LIST_WITH_ID: (listId: string) => `/lists/${listId}/items`,

  ITEM_DETAIL: '/lists/:listId/items/:itemId',
  ITEM_DETAIL_WITH_ID: (listId: string, itemId: string) => `/lists/${listId}/items/${itemId}`,

  NEW_ITEM: '/lists/:listId/items/new',
  NEW_ITEM_WITH_ID: (listId: string) => `/lists/${listId}/items/new`,

  REPORTS: '/lists/:listId/reports',
  REPORTS_WITH_ID: (listId: string) => `/lists/${listId}/reports`,

  MEMBERS: '/lists/:listId/members',
  MEMBERS_WITH_ID: (listId: string) => `/lists/${listId}/members`,
} as const
