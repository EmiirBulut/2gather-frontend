import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import styles from './OfflineIndicator.module.css'

// Cached data stays visible while offline; this pill is the only signal
const OfflineIndicator = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <span className={styles.indicator} role="status" title="İnternet bağlantısı yok. Kayıtlı veriler gösteriliyor.">
      <span className={styles.dot} aria-hidden="true" />
      Çevrimdışı
    </span>
  )
}

export default OfflineIndicator
