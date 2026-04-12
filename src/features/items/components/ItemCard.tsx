import type { ItemDto } from '../types'
import styles from './ItemCard.module.css'

interface Props {
  item: ItemDto
  onClick: (item: ItemDto) => void
}

const ItemCard = ({ item, onClick }: Props) => {
  const initials = item.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const hasPrice = item.selectedOptionSummary?.price != null

  return (
    <div
      className={`${styles.card} ${item.status === 'Purchased' ? styles.isPurchased : ''}`}
      onClick={() => onClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
    >
      {/* Thumbnail */}
      <div className={styles.thumbnail}>{initials}</div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        {item.selectedOptionSummary ? (
          <span className={styles.optionSummary}>
            {item.selectedOptionSummary.title}
          </span>
        ) : (
          <span className={styles.optionsCount}>
            {item.optionsCount > 0
              ? `${item.optionsCount} seçenek`
              : 'Seçenek yok'}
          </span>
        )}
      </div>

      {/* Right side */}
      {item.status === 'Purchased' ? (
        <span className={styles.purchasedBadge}>✓ Alındı</span>
      ) : hasPrice ? (
        <span className={styles.price}>
          ${item.selectedOptionSummary!.price!.toLocaleString()}
        </span>
      ) : null}
    </div>
  )
}

export default ItemCard
