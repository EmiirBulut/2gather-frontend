import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatPrice } from '@/lib/formatters'
import { useOptions } from '../hooks/useOptions'
import { useCreateOption } from '../hooks/useCreateOption'
import { useMarkPurchased } from '@/features/items/hooks/useMarkPurchased'
import { usePermission } from '@/hooks/usePermission'
import OptionCard from './OptionCard'
import OptionForm from './OptionForm'
import Button from '@/components/ui/Button'
import PendingClaimsPanel from '@/features/claims/components/PendingClaimsPanel'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ItemDto } from '@/features/items/types'
import type { CreateOptionRequest } from '../types'
import styles from './ItemDetailModal.module.css'

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  item: ItemDto
  listId: string
  onClose: () => void
}

const ItemDetailModal = ({ item, listId, onClose }: Props) => {
  const [isAddingOption, setIsAddingOption] = useState(false)
  const { canEdit, isOwner } = usePermission(listId)

  const { data: options, isLoading: isOptionsLoading } = useOptions(item.id)
  const { mutate: handleAddOption, isPending: isAdding, error: addError } = useCreateOption(item.id)
  const { mutate: handleMarkPurchased, isPending: isMarkingPurchased, error: purchaseError } = useMarkPurchased()

  const queryClient = useQueryClient()
  const { mutate: refreshItems } = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'Pending') })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ITEMS(listId, 'Purchased') })
    },
  })

  // Selected option price for estimated display
  const selectedOption = options?.find((o) => o.isSelected)
  const displayPrice = selectedOption?.price ?? null

  const handleMarkPurchasedClick = () => {
    handleMarkPurchased(
      { itemId: item.id, listId },
      { onSuccess: () => { refreshItems(); onClose() } }
    )
  }

  const handleAddOptionSubmit = (data: Omit<CreateOptionRequest, 'itemId'>) => {
    handleAddOption(
      { itemId: item.id, ...data },
      { onSuccess: () => setIsAddingOption(false) }
    )
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-detail-title"
      >
        {/* Sticky header */}
        <div className={styles.header}>
          <div className={styles.headerBadges}>
            <span className={`${styles.badge} ${item.status === 'Purchased' ? styles.badgePurchased : styles.badgeMustAdd}`}>
              {item.status === 'Purchased' ? '✓ Alındı' : 'Bekliyor'}
            </span>
            <span className={`${styles.badge} ${styles.badgePending}`}>
              {item.categoryName}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Hero — item title + price */}
          <div className={styles.heroSection}>
            <p className={styles.categoryLabel}>{item.categoryName}</p>
            <h2 className={styles.itemName} id="item-detail-title">{item.name}</h2>

            {displayPrice != null && (
              <div className={styles.estimatedPrice}>
                <span className={styles.priceValue}>
                  {formatPrice(displayPrice)}
                </span>
                <span className={styles.priceLabel}>Tahmini</span>
              </div>
            )}

            {/* Action buttons */}
            {canEdit && item.status === 'Pending' && (
              <div className={styles.actionsRow}>
                <Button
                  variant="primary"
                  onClick={handleMarkPurchasedClick}
                  isLoading={isMarkingPurchased}
                >
                  ✓ Satın Alındı Olarak İşaretle
                </Button>
                {purchaseError && (
                  <p className={styles.purchaseError}>{purchaseError.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Pending claims panel — owner only */}
          {isOwner && options && options.length > 0 && (
            <PendingClaimsPanel itemId={item.id} options={options} />
          )}

          {/* Sourcing Options section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Kaynak Seçenekleri</span>
              {canEdit && !isAddingOption && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingOption(true)}
                >
                  + Seçenek Ekle
                </Button>
              )}
            </div>

            <div className={styles.optionList}>
              {isOptionsLoading && (
                <div className={styles.emptyOptions}>Yükleniyor…</div>
              )}

              {!isOptionsLoading && options?.length === 0 && !isAddingOption && (
                <div className={styles.emptyOptions}>
                  Henüz seçenek yok. Fiyat karşılaştırmak için seçenek ekleyin.
                </div>
              )}

              {options?.map((option) => (
                <OptionCard
                  key={option.id}
                  option={option}
                  canEdit={canEdit}
                  isOwner={isOwner}
                  isPurchased={item.status === 'Purchased'}
                />
              ))}
            </div>

            {/* Inline add form */}
            {isAddingOption && (
              <div className={styles.addFormWrapper}>
                <p className={styles.addFormTitle}>Yeni Seçenek</p>
                <OptionForm
                  itemId={item.id}
                  isPending={isAdding}
                  error={addError?.message ?? null}
                  onSubmit={handleAddOptionSubmit}
                  onCancel={() => setIsAddingOption(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetailModal
