import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useItems } from '@/features/items/hooks/useItems'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { useListStore } from '@/store/listStore'
import { useSignalR } from '@/hooks/useSignalR'
import { usePermission } from '@/hooks/usePermission'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import AddCategoryModal from '@/features/categories/components/AddCategoryModal'
import { ROUTES } from '@/router/routes'
import type { ItemDto } from '@/features/items/types'
import styles from './ItemListPage.module.css'

const CATEGORY_ICON: Record<string, string> = {
  salon: '🛋️',
  'yatak odası': '🛏️',
  mutfak: '🍳',
  banyo: '🚿',
  'çocuk odası': '🧸',
}

const getCategoryIcon = (name: string) =>
  CATEGORY_ICON[name.toLowerCase()] ?? '📦'

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M1 1h2l2.68 11.39a2 2 0 001.94 1.61h8.76a2 2 0 001.94-1.55L20 6H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
    <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
  </svg>
)

const OptionsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="8" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="1" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <rect x="8" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
)

const ItemListPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const setActiveListId = useListStore((s) => s.setActiveListId)

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  if (listId) setActiveListId(listId)

  const { data: listDetail } = useListDetail(listId ?? '')
  const { data: items, isLoading } = useItems(listId ?? '', 'All')
  const { data: categories } = useCategories(listId ?? '')
  const { canEdit } = usePermission(listId ?? '')

  useSignalR()

  const filteredItems = useMemo(() => {
    if (!items) return []
    return selectedCategoryId
      ? items.filter((i) => i.categoryId === selectedCategoryId)
      : items
  }, [items, selectedCategoryId])

  const groupedItems = useMemo(() => {
    const map = new Map<string, { categoryName: string; items: ItemDto[] }>()
    for (const item of filteredItems) {
      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, { categoryName: item.categoryName, items: [] })
      }
      map.get(item.categoryId)!.items.push(item)
    }
    return Array.from(map.values())
  }, [filteredItems])

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  const listName = listDetail?.name ?? '—'

  return (
    <div className={styles.page}>
      <Breadcrumb items={[
        { label: listName, href: ROUTES.LIST_DETAIL_WITH_ID(listId) },
        { label: 'İtem Listesi' },
      ]} />

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>EV KURULUM LİSTESİ</span>
          <h1 className={styles.title}>İtem Listesi</h1>
        </div>
        {canEdit && (
          <button className={styles.addBtn} onClick={() => navigate(ROUTES.NEW_ITEM_WITH_ID(listId))}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            İtem Ekle
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className={styles.chipBar}>
        <button
          className={`${styles.chip} ${selectedCategoryId === null ? styles.chipActive : ''}`}
          onClick={() => setSelectedCategoryId(null)}
        >
          Hepsi
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.chip} ${selectedCategoryId === cat.id ? styles.chipActive : ''}`}
            onClick={() => setSelectedCategoryId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
        {canEdit && (
          <button className={styles.chip} onClick={() => setIsAddCategoryOpen(true)}>
            + Yeni Ekle
          </button>
        )}
      </div>

      {/* Item groups */}
      {isLoading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : groupedItems.length === 0 ? (
        <div className={styles.grid}>
          <div className={styles.emptyState}>
            <span>Henüz ürün yok.</span>
            <span>İtem eklemek için "+ İtem Ekle" butonunu kullanın.</span>
          </div>
        </div>
      ) : (
        groupedItems.map((group) => (
          <div key={group.categoryName} className={styles.group}>
            <div className={styles.groupHeader}>
              <h2 className={styles.groupTitle}>{group.categoryName}</h2>
              <span className={styles.groupCount}>{group.items.length} İtem</span>
            </div>

            <div className={styles.grid}>
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={styles.card}
                  onClick={() => navigate(ROUTES.ITEM_DETAIL_WITH_ID(listId, item.id), { state: { item } })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.ITEM_DETAIL_WITH_ID(listId, item.id), { state: { item } })}
                >
                  <div className={styles.cardImage}>
                    <span className={styles.cardImagePlaceholder}>
                      {getCategoryIcon(item.categoryName)}
                    </span>
                    <div className={styles.cardIconBadge}>
                      {getCategoryIcon(item.categoryName)}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardRow}>
                      <span className={styles.cardName}>{item.name}</span>
                      <span className={`${styles.statusBadge} ${item.status === 'Purchased' ? styles.statusPurchased : styles.statusPending}`}>
                        {item.status === 'Purchased' ? 'SATIN ALINDI' : 'BEKLİYOR'}
                      </span>
                    </div>
                    <div className={styles.cardCategory}>{item.categoryName}</div>
                    <div className={styles.cardDivider} />
                    <div className={styles.cardMeta}>
                      <span className={styles.cardOptions}>
                        <OptionsIcon />
                        {item.optionsCount} Seçenek
                      </span>
                      <span className={styles.cardPrice}>—</span>
                    </div>
                  </div>
                </div>
              ))}

              {canEdit && !selectedCategoryId && (
                <div
                  className={styles.newCard}
                  onClick={() => navigate(ROUTES.NEW_ITEM_WITH_ID(listId))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.NEW_ITEM_WITH_ID(listId))}
                >
                  <div className={styles.newCardIcon}>+</div>
                  <span className={styles.newCardLabel}>Yeni İtem Ekle</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <button className={styles.fab} aria-label="Sepet">
        <CartIcon />
      </button>

      {isAddCategoryOpen && (
        <AddCategoryModal listId={listId} onClose={() => setIsAddCategoryOpen(false)} />
      )}
    </div>
  )
}

export default ItemListPage
