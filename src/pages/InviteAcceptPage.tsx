import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { acceptInvite } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { normalizeError } from '@/services/api'
import { ROUTES } from '@/router/routes'
import styles from './InviteAcceptPage.module.css'

const InviteAcceptPage = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('Davet bağlantısı geçersiz.')
      return acceptInvite(token)
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
      sessionStorage.setItem('refresh-token', data.refreshToken)
      navigate(ROUTES.LISTS)
    },
    onError: (err: unknown) => normalizeError(err),
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoMark}>2G</div>
        {isPending && (
          <>
            <div className={styles.spinner} />
            <h2 className={styles.title}>Davet kabul ediliyor…</h2>
            <p className={styles.subtitle}>Lütfen bekleyin, sizi listeye ekliyoruz.</p>
          </>
        )}
        {isError && (
          <>
            <h2 className={styles.titleError}>Davet geçersiz</h2>
            <p className={styles.subtitle}>
              {error instanceof Error ? error.message : 'Bu davet bağlantısı kullanılamıyor.'}
            </p>
            <button className={styles.link} onClick={() => navigate(ROUTES.LOGIN)}>
              Giriş sayfasına dön
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default InviteAcceptPage
