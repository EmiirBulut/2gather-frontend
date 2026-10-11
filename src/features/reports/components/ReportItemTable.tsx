import { useNavigate } from 'react-router-dom'
import { formatPrice } from '@/lib/formatters'
import { ROUTES } from '@/router/routes'
import type { ReportItemDto } from '../types'
import styles from './ReportItemTable.module.css'

const CATEGORY_ICON: Record<string, string> = {
  salon: '🛋️',
  'yatak odası': '🛏️',
  mutfak: '🍳',
  banyo: '🚿',
  'çocuk odası': '🧸',
}
const getCategoryIcon = (name: string) => CATEGORY_ICON[name.toLowerCase()] ?? '📦'

interface Props {
  listId: string
  items: ReportItemDto[]
}

const ReportItemTable = ({ listId, items }: Props) => {
  const navigate = useNavigate()

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHead}>
        <span className={styles.colImage}>GÖRSEL</span>
        <span className={styles.colName}>İTEM ADI</span>
        <span className={styles.colCategory}>KATEGORİ</span>
        <span className={styles.colPrice}>FİYAT</span>
        <span className={styles.colPurchasers}>SATIN ALAN</span>
        <span className={styles.colStatus}>DURUM</span>
      </div>
      {items.map(({ id, name, imageUrl, categoryName, optionsCount, estimatedPrice, purchasers, status }) => {
        const detailPath = ROUTES.ITEM_DETAIL_WITH_ID(listId, id)
        const isPurchased = status === 'Purchased'
        const purchaserNames = purchasers.length > 0 ? purchasers.map((p) => p.displayName).join(', ') : '—'

        return (
          <div
            key={id}
            className={styles.tableRow}
            onClick={() => navigate(detailPath)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(detailPath)}
          >
            <span className={styles.colImage}>
              {imageUrl ? (
                <img src={imageUrl} alt={name} className={styles.thumbnail} loading="lazy" />
              ) : (
                <span className={styles.itemEmoji}>{getCategoryIcon(categoryName)}</span>
              )}
            </span>
            <span className={styles.colName}>
              <span className={styles.itemName}>{name}</span>
              <span className={styles.itemSub}>{optionsCount} seçenek</span>
            </span>
            <span className={styles.colCategory}>
              <span className={styles.categoryBadge}>{categoryName}</span>
            </span>
            <span className={styles.colPrice}>{formatPrice(estimatedPrice)}</span>
            <span className={styles.colPurchasers} title={purchaserNames}>{purchaserNames}</span>
            <span className={styles.colStatus}>
              <span className={`${styles.statusBadge} ${isPurchased ? styles.statusPurchased : styles.statusPending}`}>
                {isPurchased ? 'Satın Alındı' : 'Bekliyor'}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default ReportItemTable
