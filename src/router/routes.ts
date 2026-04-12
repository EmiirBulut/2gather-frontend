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

  REPORTS: '/lists/:listId/reports',
  REPORTS_WITH_ID: (listId: string) => `/lists/${listId}/reports`,

  MEMBERS: '/lists/:listId/members',
  MEMBERS_WITH_ID: (listId: string) => `/lists/${listId}/members`,
} as const
