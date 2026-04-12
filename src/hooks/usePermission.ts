import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { MemberDto } from '@/features/members/types'

interface Permission {
  canEdit: boolean
  canManageMembers: boolean
  isOwner: boolean
}

// Reads member list from existing TanStack Query cache — no extra API call.
export function usePermission(listId: string): Permission {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const members = queryClient.getQueryData<MemberDto[]>(QUERY_KEYS.MEMBERS(listId))

  if (!user || !members) {
    return { canEdit: false, canManageMembers: false, isOwner: false }
  }

  const me = members.find((m) => m.userId === user.id)

  if (!me) {
    return { canEdit: false, canManageMembers: false, isOwner: false }
  }

  const isOwner = me.role === 'Owner'
  const canEdit = me.role === 'Owner' || me.role === 'Editor'
  const canManageMembers = isOwner

  return { canEdit, canManageMembers, isOwner }
}
