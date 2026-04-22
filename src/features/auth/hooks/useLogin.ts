import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuthStore } from '@/store/authStore'
import { normalizeError, type ApiError } from '@/services/api'
import { ROUTES } from '@/router/routes'
import { PENDING_INVITE_KEY } from '@/pages/InviteAcceptPage'
import type { LoginRequest } from '../types'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation<void, ApiError, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const response = await login(data)
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
