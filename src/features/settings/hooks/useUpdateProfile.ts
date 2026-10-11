import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/settingsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import { normalizeError, type ApiError } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { UpdateProfileRequest, UserProfileDto } from '../types'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)

  return useMutation<UserProfileDto, ApiError, UpdateProfileRequest>({
    mutationFn: async (data) => {
      try {
        return await updateProfile(data)
      } catch (error) {
        throw normalizeError(error)
      }
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, profile)
      updateUser(profile)
      // Member lists and avatars show the display name
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LISTS })
    },
  })
}
