import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../api/settingsApi'
import { normalizeError, type ApiError } from '@/services/api'
import type { ChangePasswordRequest } from '../types'

export function useChangePassword() {
  return useMutation<void, ApiError, ChangePasswordRequest>({
    mutationFn: async (data) => {
      try {
        await changePassword(data)
      } catch (error) {
        throw normalizeError(error)
      }
    },
  })
}
