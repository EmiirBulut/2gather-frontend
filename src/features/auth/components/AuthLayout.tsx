import styles from './AuthLayout.module.css'

interface Props {
  eyebrow: string
  title: string
  children: React.ReactNode
}

const AuthLayout = ({ eyebrow, title, children }: Props) => (
  <div className={styles.layout}>
    <div className={styles.card}>
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroTop}>
          <span className={styles.logo}>2gather</span>
        </div>
        <div className={styles.heroBottom}>
          <h1 className={styles.heroHeadline}>Birlikte Planlayın</h1>
          <p className={styles.heroSubline}>
            Eşiniz, aileniz ve sevdiklerinizle aynı anda — tek bir listede.
          </p>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <div className={styles.formHeader}>
            <span className={styles.formEyebrow}>{eyebrow}</span>
            <h2 className={styles.formTitle}>{title}</h2>
          </div>
          {children}
          <p className={styles.footer}>© 2024 2GATHER. TÜM HAKLARI SAKLIDIR.</p>
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout
