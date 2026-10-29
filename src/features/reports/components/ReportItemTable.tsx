import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '@/lib/formatters'
import { ROUTES } from '@/router/routes'
import type { ReportItemDto, ReportOptionDto } from '../types'
import styles from './ReportItemTable.module.css'

const CATEGORY_ICON: Record<string, string> = {
  salon: '🛋️',
  'yatak odası': '🛏️',
  mutfak: '🍳',
  banyo: '🚿',
  'çocuk odası': '🧸',
}
const getCategoryIcon = (name: string) => CATEGORY_ICON[name.toLowerCase()] ?? '📦'

// Purchased item: the bought option is highlighted and the rest are faded.
// Pending item: every option stays readable; the final decision gets a badge.
const getOptionState = (option: ReportOptionDto, isItemPurchased: boolean): 'bought' | 'faded' | 'normal' => {
  if (!isItemPurchased) return 'normal'
  return option.isPurchased ? 'bought' : 'faded'
}

const getOptionBadge = ({ isPurchased, isFinal, isSelected }: ReportOptionDto): string | null => {
  if (isPurchased) return 'Satın alınan'
  if (isFinal) return 'Nihai karar'
  if (isSelected) return 'Seçili'
  return null
}

interface Props {
  listId: string
  items: ReportItemDto[]
}

const ReportItemTable = ({ listId, items }: Props) => {
  const navigate = useNavigate()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

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
      {items.map(({ id, name, imageUrl, categoryName, roomLabel, options, estimatedPrice, purchasers, status }) => {
        const isPurchased = status === 'Purchased'
        const isExpanded = expandedIds.has(id)
        const hasOptions = options.length > 0
        const purchaserNames = purchasers.length > 0 ? purchasers.map((p) => p.displayName).join(', ') : '—'
        const handleRowClick = () => (hasOptions ? toggle(id) : navigate(ROUTES.ITEM_DETAIL_WITH_ID(listId, id)))

        return (
          <Fragment key={id}>
            <div
              className={`${styles.tableRow} ${isExpanded ? styles.tableRowExpanded : ''}`}
              onClick={handleRowClick}
              role="button"
              tabIndex={0}
              aria-expanded={hasOptions ? isExpanded : undefined}
              onKeyDown={(e) => e.key === 'Enter' && handleRowClick()}
            >
              <span className={styles.colImage}>
                {imageUrl ? (
                  <img src={imageUrl} alt={name} className={styles.thumbnail} loading="lazy" />
                ) : (
                  <span className={styles.itemEmoji}>{getCategoryIcon(categoryName)}</span>
                )}
              </span>
              <span className={styles.colName}>
                <span className={styles.itemName}>
                  {hasOptions && (
                    <svg className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M4.5 2.5 8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {name}
                </span>
                <span className={styles.itemSub}>{options.length} seçenek</span>
              </span>
              <span className={styles.colCategory}>
                <span className={styles.categoryBadge}>{categoryName}</span>
                <span className={styles.roomLabel}>{roomLabel}</span>
              </span>
              <span className={styles.colPrice}>{formatPrice(estimatedPrice)}</span>
              <span className={styles.colPurchasers} title={purchaserNames}>{purchaserNames}</span>
              <span className={styles.colStatus}>
                <span className={`${styles.statusBadge} ${isPurchased ? styles.statusPurchased : styles.statusPending}`}>
                  {isPurchased ? 'Satın Alındı' : 'Bekliyor'}
                </span>
              </span>
            </div>

            {isExpanded && (
              <div className={styles.optionsPanel}>
                {options.map((option) => {
                  const state = getOptionState(option, isPurchased)
                  const badge = getOptionBadge(option)
                  return (
                    <div key={option.id} className={`${styles.optionRow} ${styles[`option_${state}`]}`}>
                      <span className={styles.optionTitle}>{option.title}</span>
                      {badge && <span className={styles.optionBadge}>{badge}</span>}
                      <span className={styles.optionPrice}>{formatPrice(option.price)}</span>
                    </div>
                  )
                })}
                <button
                  type="button"
                  className={styles.detailLink}
                  onClick={() => navigate(ROUTES.ITEM_DETAIL_WITH_ID(listId, id))}
                >
                  Ürün detayına git →
                </button>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ReportItemTable
