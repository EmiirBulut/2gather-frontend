import type { ApiError } from '@/services/api'

const GENERIC_ERROR = 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'

// 400/422 responses from these endpoints carry user-facing Turkish messages
export const getSettingsErrorMessage = (error: ApiError | null): string | null => {
  if (!error) return null
  if (error.isOffline) return error.message
  return error.statusCode === 400 || error.statusCode === 422 ? error.message : GENERIC_ERROR
}
