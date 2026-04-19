import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useOptions } from '@/features/options/hooks/useOptions'
import { useCreateOption } from '@/features/options/hooks/useCreateOption'
import { useMarkPurchased } from '@/features/items/hooks/useMarkPurchased'
import { usePermission } from '@/hooks/usePermission'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import OptionCard from '@/features/options/components/OptionCard'
import OptionForm from '@/features/options/components/OptionForm'
import { ROUTES } from '@/router/routes'
import type { ItemDto } from '@/features/items/types'
import type { CreateOptionRequest } from '@/features/options/types'
import styles from './ItemDetailPage.module.css'

const CATEGORY_ICON: Record<string, string> = {
  salon: '🛋️',
  'yatak odası': '🛏️',
  mutfak: '🍳',
  banyo: '🚿',
  'çocuk odası': '🧸',
}
const getCategoryIcon = (name: string) => CATEGORY_ICON[name.toLowerCase()] ?? '📦'

const ItemDetailPage = () => {
  const { listId, itemId } = useParams<{ listId: string; itemId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const item = location.state?.item as ItemDto | undefined

  const [isAddingOption, setIsAddingOption] = useState(false)

  const { canEdit, isOwner } = usePermission(listId ?? '')
  const { data: listDetail } = useListDetail(listId ?? '')
  const { data: options, isLoading: optionsLoading } = useOptions(itemId ?? '')
  const { mutate: handleAddOption, isPending: isAdding, error: addError } = useCreateOption(itemId ?? '')
  const { mutate: handleMarkPurchased, isPending: isMarkingPurchased } = useMarkPurchased()

  if (!listId || !itemId) {
    navigate(ROUTES.LISTS)
    return null
  }

  if (!item) {
    navigate(ROUTES.ITEM_LIST_WITH_ID(listId))
    return null
  }

  const handleAddOptionSubmit = (data: Omit<CreateOptionRequest, 'itemId'>) => {
    handleAddOption(
      { itemId, ...data },
      { onSuccess: () => setIsAddingOption(false) }
    )
  }

  const handleMarkPurchasedClick = () => {
    handleMarkPurchased(
      { itemId, listId },
      { onSuccess: () => navigate(ROUTES.ITEM_LIST_WITH_ID(listId)) }
    )
  }

  const listName = listDetail?.name ?? '—'
  const selectedOption = options?.find((o) => o.isSelected)

  return (
    <div className={styles.page}>
      <Breadcrumb items={[
        { label: listName, href: ROUTES.LIST_DETAIL_WITH_ID(listId) },
        { label: 'İtem Listesi', href: ROUTES.ITEM_LIST_WITH_ID(listId) },
        { label: item.categoryName, href: ROUTES.ITEM_LIST_WITH_ID(listId) },
        { label: item.name },
      ]} />

      <div className={styles.layout}>
        {/* ── Sol sütun ── */}
        <div className={styles.leftCol}>
          <p className={styles.eyebrow}>{item.categoryName.toUpperCase()}</p>
          <h1 className={styles.title}>{item.name}</h1>

          <div className={styles.imageWrapper}>
            <span className={styles.imagePlaceholder}>
              {getCategoryIcon(item.categoryName)}
            </span>
            <div className={styles.imageTags}>
              <span className={styles.imageTag}>{item.categoryName.toUpperCase()}</span>
              {item.status === 'Purchased' && (
                <span className={styles.imageTag}>SATIN ALINDI</span>
              )}
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Seçenekler</h2>

          <div className={styles.optionsList}>
            {optionsLoading && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Yükleniyor…</p>
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
            {!optionsLoading && options?.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
                Henüz seçenek eklenmemiş.
              </p>
            )}
            {isAddingOption && (
              <OptionForm
                itemId={itemId}
                isPending={isAdding}
                error={addError?.message ?? null}
                onSubmit={handleAddOptionSubmit}
                onCancel={() => setIsAddingOption(false)}
              />
            )}
          </div>
        </div>

        {/* ── Sağ panel ── */}
        <div className={styles.rightCol}>
          {/* Seçenekler meta */}
          <div className={styles.panelCard}>
            <div className={styles.panelCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={styles.panelCardTitle}>Seçenekler</span>
                <span className={styles.panelPill}>{options?.length ?? 0} Kayıt</span>
              </div>
            </div>

            {canEdit && (
              <button
                className={styles.addOptionBtn}
                onClick={() => setIsAddingOption(true)}
              >
                + Seçenek Ekle
              </button>
            )}

            <div className={styles.panelDivider} />

            <div className={styles.panelRow}>
              <span className={styles.panelRowLabel}>Durum</span>
              <span className={styles.panelRowValue}>
                {item.status === 'Purchased' ? 'Tamamlandı' : 'Bekliyor'}
              </span>
            </div>
            <div className={styles.panelRow}>
              <span className={styles.panelRowLabel}>Son Güncelleme</span>
              <span className={styles.panelRowValue}>—</span>
            </div>
            {selectedOption && (
              <div className={styles.panelRow}>
                <span className={styles.panelRowLabel}>Seçilen</span>
                <span className={styles.panelRowValue}>{selectedOption.title}</span>
              </div>
            )}
          </div>

          {/* Teknik Detaylar */}
          {selectedOption && (selectedOption.brand || selectedOption.model || selectedOption.color) && (
            <div className={styles.panelCard}>
              <p className={styles.techEyebrow}>TEKNİK DETAYLAR</p>
              <div className={styles.techGrid}>
                {selectedOption.brand && (
                  <div className={styles.techItem}>
                    <span className={styles.techLabel}>Marka</span>
                    <span className={styles.techValue}>{selectedOption.brand}</span>
                  </div>
                )}
                {selectedOption.model && (
                  <div className={styles.techItem}>
                    <span className={styles.techLabel}>Model</span>
                    <span className={styles.techValue}>{selectedOption.model}</span>
                  </div>
                )}
              </div>
              {selectedOption.color && (
                <div className={styles.techItem}>
                  <span className={styles.techLabel}>Renk / Malzeme</span>
                  <span className={styles.techValue}>{selectedOption.color}</span>
                </div>
              )}
            </div>
          )}

          {/* Planlama Notu */}
          {selectedOption?.notes && (
            <div className={styles.noteCard}>
              <div className={styles.noteHeader}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.3"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span className={styles.noteTitle}>Planlama Notu</span>
              </div>
              <p className={styles.noteText}>{selectedOption.notes}</p>
            </div>
          )}

          {/* Satın alma */}
          {canEdit && item.status !== 'Purchased' && (
            <div className={styles.panelCard}>
              <button
                className={styles.markPurchasedBtn}
                onClick={handleMarkPurchasedClick}
                disabled={isMarkingPurchased}
              >
                {isMarkingPurchased ? 'İşleniyor…' : '✓ Satın Alındı Olarak İşaretle'}
              </button>
            </div>
          )}

          {item.status === 'Purchased' && (
            <div className={styles.panelCard}>
              <div className={styles.purchasedBanner}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Satın Alındı
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetailPage
