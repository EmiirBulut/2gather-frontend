import { ROUTES } from '@/router/routes'
import styles from './RouteErrorPage.module.css'

// Shown by the router instead of its default English error screen when a page crashes
const RouteErrorPage = () => (
  <div className={styles.page}>
    <div className={styles.card}>
      <h1 className={styles.title}>Bir şeyler ters gitti</h1>
      <p className={styles.text}>
        Sayfa yüklenirken beklenmeyen bir hata oluştu. Yaptığınız değişiklikler kaydedilmiş olabilir.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => window.location.reload()}>
          Sayfayı yenile
        </button>
        {/* Full navigation so a broken in-memory state is discarded */}
        <a className={styles.secondary} href={ROUTES.LISTS}>Listelere dön</a>
      </div>
    </div>
  </div>
)

export default RouteErrorPage
