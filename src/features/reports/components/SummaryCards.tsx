import { formatPrice } from '@/lib/formatters'
import type { ListSummaryReport } from '../types'
import styles from './SummaryCards.module.css'

interface Props {
  data: ListSummaryReport
}

const SummaryCards = ({ data }: Props) => {
  const completionPct = data.totalItems > 0
    ? Math.round((data.purchasedCount / data.totalItems) * 100)
    : 0

  const cards = [
    { label: 'Toplam Ürün', value: data.totalItems.toString() },
    { label: 'Tamamlanan', value: data.purchasedCount.toString(), accent: 'purchased' },
    { label: 'Bekleyen', value: data.pendingCount.toString(), accent: 'pending' },
    { label: 'Harcanan', value: formatPrice(data.totalSpent), accent: 'primary' },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.overview}>
        <p className={styles.overviewLabel}>Finansal Genel Bakış</p>
        <p className={styles.totalInvestment}>
          {formatPrice(data.estimatedTotal)}
        </p>
        <p className={styles.investmentLabel}>Tahmini Toplam</p>

        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${completionPct}%` }} />
          </div>
          <span className={styles.progressPct}>{completionPct}% tamamlandı</span>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} className={`${styles.card} ${card.accent ? styles[`accent_${card.accent}`] : ''}`}>
            <span className={styles.cardValue}>{card.value}</span>
            <span className={styles.cardLabel}>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SummaryCards
