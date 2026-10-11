import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/router/routes'
import styles from './SettingsSection.module.css'

const AppPreferencesSection = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Uygulama</h2>
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <span className={styles.rowTitle}>Oturum</span>
          <span className={styles.rowHint}>Bu cihazdaki oturumunuzu kapatır.</span>
        </div>
        <Button variant="secondary" onClick={handleLogout}>Çıkış Yap</Button>
      </div>
    </section>
  )
}

export default AppPreferencesSection
