import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/queryKeys'
import {
  getPendingInvites,
  inviteMember,
  cancelInvite,
  resendInvite,
} from '../api/membersApi'
import type { InviteMemberRequest } from '../types'

export function usePendingInvites(listId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PENDING_INVITES(listId),
    queryFn: () => getPendingInvites(listId),
    enabled: Boolean(listId),
  })
}

export function useInviteMember(listId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InviteMemberRequest) => inviteMember(listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_INVITES(listId) })
    },
  })
}

export function useCancelInvite(listId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (inviteId: string) => cancelInvite(listId, inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENDING_INVITES(listId) })
    },
  })
}

export function useResendInvite(listId: string) {
  return useMutation({
    mutationFn: (inviteId: string) => resendInvite(listId, inviteId),
  })
}
