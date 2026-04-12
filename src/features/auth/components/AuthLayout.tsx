import styles from './AuthLayout.module.css'

interface Props {
  title: string
  subtitle: string
  children: React.ReactNode
}

const FEATURES = [
  'Alışveriş listesi yönetimi',
  'Gerçek zamanlı iş birliği',
  'Kategori bazlı raporlar',
]

const AuthLayout = ({ title, subtitle, children }: Props) => {
  return (
    <div className={styles.layout}>
      {/* Sol — hero */}
      <div className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroTop}>
          <div className={styles.logo}>
            <div className={styles.logoMark}>2G</div>
            <span className={styles.logoName}>2Gather</span>
          </div>
          <div>
            <h1 className={styles.heroHeadline}>
              Düğününüzü birlikte planlayın.
            </h1>
            <p className={styles.heroSubline}>
              Eşiniz, aileniz ve sevdiklerinizle aynı anda — tek bir listede.
            </p>
          </div>
        </div>

        <div className={styles.heroBottom}>
          {FEATURES.map((feature) => (
            <div key={feature} className={styles.featureTag}>
              <span className={styles.featureDot} />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Sağ — form */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>{title}</h2>
            <p className={styles.formSubtitle}>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
