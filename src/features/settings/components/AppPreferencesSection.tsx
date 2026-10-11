import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useUiStore, type ThemePreference } from '@/store/uiStore'
import { ROUTES } from '@/router/routes'
import styles from './SettingsSection.module.css'

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistem' },
  { value: 'light', label: 'Açık' },
  { value: 'dark', label: 'Koyu' },
]

const AppPreferencesSection = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const themePreference = useUiStore((s) => s.themePreference)
  const setThemePreference = useUiStore((s) => s.setThemePreference)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Uygulama</h2>
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <span className={styles.rowTitle}>Tema</span>
          <span className={styles.rowHint}>Sistem seçeneği cihazınızın ayarını takip eder.</span>
        </div>
        <div className={styles.segmented} role="radiogroup" aria-label="Tema">
          {THEME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={themePreference === value}
              className={`${styles.segment} ${themePreference === value ? styles.segmentActive : ''}`}
              onClick={() => setThemePreference(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <hr className={styles.divider} />
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
