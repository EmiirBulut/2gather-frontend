import { usePWAInstall } from '@/hooks/usePWAInstall'
import styles from './InstallAppButton.module.css'

// Small outline button; renders nothing unless the browser offers installation
const InstallAppButton = () => {
  const { isInstallable, promptInstall } = usePWAInstall()

  if (!isInstallable) return null

  return (
    <button type="button" className={styles.button} onClick={promptInstall}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1.5v7m0 0L4.25 5.75M7 8.5l2.75-2.75M2 10.5v1a1 1 0 001 1h8a1 1 0 001-1v-1"
          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Ana ekrana ekle
    </button>
  )
}

export default InstallAppButton
