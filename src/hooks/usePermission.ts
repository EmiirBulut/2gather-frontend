import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ListSummaryDto } from '@/features/lists/types'
import type { MemberDto } from '@/features/members/types'

interface Permission {
  canEdit: boolean
  canManageMembers: boolean
  isOwner: boolean
}

// Reads member list from TanStack Query cache — no extra API call.
// Falls back to checking ownerId from the lists cache when members are not loaded
// (members endpoint may not be available yet).
export function usePermission(listId: string): Permission {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return { canEdit: false, canManageMembers: false, isOwner: false }
  }

  // Try members cache first (populated once Phase 7 members feature is live)
  const members = queryClient.getQueryData<MemberDto[]>(QUERY_KEYS.MEMBERS(listId))
  if (members) {
    const me = members.find((m) => m.userId === user.id)
    if (!me) return { canEdit: false, canManageMembers: false, isOwner: false }
    const isOwner = me.role === 'Owner'
    const canEdit = isOwner || me.role === 'Editor'
    return { canEdit, canManageMembers: isOwner, isOwner }
  }

  // Fallback: check ownerId from lists cache
  const lists = queryClient.getQueryData<ListSummaryDto[]>(QUERY_KEYS.LISTS)
  const list = lists?.find((l) => l.id === listId)
  if (list) {
    const isOwner = list.ownerId === user.id
    return { canEdit: isOwner, canManageMembers: isOwner, isOwner }
  }

  // Default: grant edit to allow basic usage until members are loaded
  return { canEdit: true, canManageMembers: false, isOwner: false }
}
