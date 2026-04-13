import { useMutation } from '@tanstack/react-query'
import { inviteMember } from '../api/membersApi'
import type { ApiError } from '@/services/api'
import type { InviteRequest } from '../types'
import type { InviteResponse } from '../api/membersApi'

interface Variables {
  listId: string
  data: InviteRequest
}

export function useInviteMember() {
  return useMutation<InviteResponse, ApiError, Variables>({
    mutationFn: ({ listId, data }) => inviteMember(listId, data),
  })
}
