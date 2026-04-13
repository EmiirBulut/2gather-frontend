import type { CategoryReport } from '../types'
import styles from './CategoryTable.module.css'

interface Props {
  data: CategoryReport[]
}

const CategoryTable = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>
        Henüz kategori verisi yok.
      </div>
    )
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <span className={styles.colCategory}>Kategori</span>
        <span className={styles.colNum}>Toplam</span>
        <span className={styles.colNum}>Alınan</span>
        <span className={styles.colNum}>Bekleyen</span>
        <span className={styles.colBar}>İlerleme</span>
      </div>

      {data.map((row) => {
        const pct = row.totalItems > 0
          ? Math.round((row.purchasedCount / row.totalItems) * 100)
          : 0
        return (
          <div key={row.categoryId} className={styles.tableRow}>
            <span className={styles.colCategory}>{row.categoryName}</span>
            <span className={styles.colNum}>{row.totalItems}</span>
            <span className={`${styles.colNum} ${styles.purchased}`}>{row.purchasedCount}</span>
            <span className={`${styles.colNum} ${styles.pending}`}>{row.pendingCount}</span>
            <div className={styles.colBar}>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.barPct}>{pct}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CategoryTable
