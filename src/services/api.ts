import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { queryClient } from '@/lib/queryClient'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Token Helpers ────────────────────────────────────────────────────────────

// Lazy import to avoid circular dependency with Zustand store
function getAccessToken(): string | null {
  try {
    const raw = sessionStorage.getItem('auth-storage')
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string } }
    return parsed?.state?.accessToken ?? null
  } catch {
    return null
  }
}

function getRefreshToken(): string | null {
  return sessionStorage.getItem('refresh-token')
}

function setTokens(accessToken: string, refreshToken: string): void {
  // Auth store will be updated via the response; persist refresh token separately
  sessionStorage.setItem('refresh-token', refreshToken)
  // Update Zustand auth store's persisted state directly
  try {
    const raw = sessionStorage.getItem('auth-storage')
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: Record<string, unknown> }
      if (parsed.state) {
        parsed.state.accessToken = accessToken
        sessionStorage.setItem('auth-storage', JSON.stringify(parsed))
      }
    }
  } catch {
    // ignore
  }
}

function clearSession(): void {
  sessionStorage.removeItem('auth-storage')
  sessionStorage.removeItem('refresh-token')
  queryClient.clear()
}

// ─── Request Interceptor — Attach JWT ─────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

// ─── Response Interceptor — 401 Refresh ───────────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error)
    } else if (token) {
      p.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!(error instanceof AxiosError)) return Promise.reject(error)

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(normalizeError(error))
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearSession()
      window.location.href = '/login'
      return Promise.reject(normalizeError(error))
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post<RefreshResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
        { refreshToken }
      )
      setTokens(data.accessToken, data.refreshToken)
      processQueue(null, data.accessToken)
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearSession()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

// ─── Error Normalizer ─────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode: number | null
  errors?: Record<string, string[]>
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? null
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined

    return {
      message: data?.message ?? error.message ?? 'Beklenmeyen bir hata oluştu',
      statusCode: status,
      errors: data?.errors,
    }
  }
  return {
    message: 'Beklenmeyen bir hata oluştu',
    statusCode: null,
  }
}
