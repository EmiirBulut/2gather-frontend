import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ListDetailNormalized, ListSummaryDto } from '@/features/lists/types'
import type { MemberDto } from '@/features/members/types'

interface Permission {
  canEdit: boolean
  canManageMembers: boolean
  isOwner: boolean
}

// Reads roles from TanStack Query cache — no extra API call.
// Priority: standalone members cache → list detail embedded members → lists ownerId → default.
export function usePermission(listId: string): Permission {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return { canEdit: false, canManageMembers: false, isOwner: false }
  }

  // 1. Standalone members cache (Phase 7, when members endpoint is available)
  const members = queryClient.getQueryData<MemberDto[]>(QUERY_KEYS.MEMBERS(listId))
  if (members) {
    const me = members.find((m) => m.userId === user.id)
    if (!me) return { canEdit: false, canManageMembers: false, isOwner: false }
    const isOwner = me.role === 'Owner'
    return { canEdit: isOwner || me.role === 'Editor', canManageMembers: isOwner, isOwner }
  }

  // 2. List detail cache — GET /api/lists/:id embeds members array
  const listDetail = queryClient.getQueryData<ListDetailNormalized>(QUERY_KEYS.LIST_DETAIL(listId))
  if (listDetail?.members) {
    const me = listDetail.members.find((m) => m.userId === user.id)
    if (!me) return { canEdit: false, canManageMembers: false, isOwner: false }
    const isOwner = me.role === 'Owner'
    return { canEdit: isOwner || me.role === 'Editor', canManageMembers: isOwner, isOwner }
  }

  // 3. Lists summary cache — check currentUserRole
  const lists = queryClient.getQueryData<ListSummaryDto[]>(QUERY_KEYS.LISTS)
  const list = lists?.find((l) => l.id === listId)
  if (list) {
    const isOwner = list.currentUserRole === 0
    return { canEdit: isOwner || list.currentUserRole === 1, canManageMembers: isOwner, isOwner }
  }

  // 4. Default: grant edit until role is determined
  return { canEdit: true, canManageMembers: false, isOwner: false }
}
