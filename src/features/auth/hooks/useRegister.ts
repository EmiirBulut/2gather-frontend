import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import { useAuthStore } from '@/store/authStore'
import { normalizeError, type ApiError } from '@/services/api'
import { ROUTES } from '@/router/routes'
import { PENDING_INVITE_KEY } from '@/pages/InviteAcceptPage'
import type { RegisterRequest } from '../types'

export function useRegister() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<void, ApiError, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const response = await register(data)
      setAuth(response.accessToken, response.user)
      sessionStorage.setItem('refresh-token', response.refreshToken)
    },
    onSuccess: () => {
      const pendingToken = sessionStorage.getItem(PENDING_INVITE_KEY)
      if (pendingToken) {
        navigate(ROUTES.INVITE_WITH_TOKEN(pendingToken), { replace: true })
      } else {
        navigate(ROUTES.LISTS)
      }
    },
    onError: (error: unknown) => {
      return normalizeError(error)
    },
  })
}
