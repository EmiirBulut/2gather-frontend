import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useItems } from '@/features/items/hooks/useItems'
import StatusFilter from '@/features/items/components/StatusFilter'
import ItemListGroup from '@/features/items/components/ItemListGroup'
import AddItemModal from '@/features/items/components/AddItemModal'
import ItemDetailModal from '@/features/options/components/ItemDetailModal'
import { useListStore } from '@/store/listStore'
import { useSignalR } from '@/hooks/useSignalR'
import OnlinePresence from '@/features/members/components/OnlinePresence'
import { ROUTES } from '@/router/routes'
import type { ItemDto, StatusFilter as StatusFilterType } from '@/features/items/types'
import styles from './ListDetailPage.module.css'

const ListDetailPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const setActiveListId = useListStore((s) => s.setActiveListId)

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('Pending')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ItemDto | null>(null)

  // Set active list in global store
  if (listId) setActiveListId(listId)

  // Real-time updates via SignalR
  useSignalR()

  const { data: items, isLoading, isError } = useItems(listId ?? '', statusFilter)

  // Group items by category
  const groupedItems = useMemo(() => {
    if (!items) return []
    const map = new Map<string, { categoryName: string; items: ItemDto[] }>()
    for (const item of items) {
      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, { categoryName: item.categoryName, items: [] })
      }
      map.get(item.categoryId)!.items.push(item)
    }
    return Array.from(map.values())
  }, [items])

  // Stats for completion bar
  const totalCount = items?.length ?? 0
  const purchasedCount = items?.filter((i) => i.status === 'Purchased').length ?? 0
  const completionPct = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0

  const handleItemClick = (item: ItemDto) => {
    setSelectedItem(item)
    // Phase 5: will open ItemDetailModal
  }

  const handleBack = () => {
    setActiveListId(null)
    navigate(ROUTES.LISTS)
  }

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button className={styles.backBtn} onClick={handleBack}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12 6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Listeler
          </button>
          <div className={styles.navLogoMark}>2G</div>
        </div>
        <div className={styles.navRight}>
          <OnlinePresence listId={listId} />
          <button
            className={styles.backBtn}
            onClick={() => navigate(ROUTES.MEMBERS_WITH_ID(listId))}
          >
            Üyeler
          </button>
          <button
            className={styles.backBtn}
            onClick={() => navigate(ROUTES.REPORTS_WITH_ID(listId))}
          >
            Rapor
          </button>
        </div>
      </nav>

      {/* Hero — Living Room Items görselindeki üst panel */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div>
              <p className={styles.heroLabel}>Liste Detayı</p>
              <h1 className={styles.heroTitle}>Ürün Listesi</h1>
              <div className={styles.heroMeta}>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaValue}>{totalCount}</span>
                  <span className={styles.heroMetaLabel}>Toplam Ürün</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaValue}>{totalCount - purchasedCount}</span>
                  <span className={styles.heroMetaLabel}>Bekleyen</span>
                </div>
                <div className={styles.heroMetaItem}>
                  <span className={styles.heroMetaValue}>{purchasedCount}</span>
                  <span className={styles.heroMetaLabel}>Tamamlanan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Completion bar */}
          <div className={styles.completionBar}>
            <div className={styles.completionLabel}>
              <span className={styles.completionText}>Tamamlanma</span>
              <span className={styles.completionPct}>{completionPct}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={styles.main}>
        {/* Status filter */}
        <div className={styles.filterBar}>
          <StatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            pendingCount={statusFilter === 'All' ? items?.filter((i) => i.status === 'Pending').length : undefined}
            purchasedCount={statusFilter === 'All' ? purchasedCount : undefined}
          />
        </div>

        {/* Item groups */}
        <div className={styles.itemGroups}>
          {isLoading && (
            <>{[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeleton} />)}</>
          )}

          {isError && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>Ürünler yüklenemedi</p>
              <p className={styles.emptySubtitle}>Bir hata oluştu. Sayfayı yenilemeyi deneyin.</p>
            </div>
          )}

          {!isLoading && !isError && groupedItems.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>
                {statusFilter === 'Pending' ? 'Bekleyen ürün yok' :
                 statusFilter === 'Purchased' ? 'Henüz alınan ürün yok' :
                 'Liste boş'}
              </p>
              <p className={styles.emptySubtitle}>
                {statusFilter === 'Pending'
                  ? 'Harika! Tüm ürünler tamamlandı.'
                  : 'Ürün eklemek için + butonunu kullanın.'}
              </p>
            </div>
          )}

          {!isLoading && !isError && groupedItems.map((group) => (
            <ItemListGroup
              key={group.categoryName}
              categoryName={group.categoryName}
              items={group.items}
              onItemClick={handleItemClick}
            />
          ))}
        </div>
      </main>

      {/* FAB */}
      <button className={styles.fab} onClick={() => setIsAddModalOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Ürün Ekle
      </button>

      {/* Modals */}
      {isAddModalOpen && (
        <AddItemModal listId={listId} onClose={() => setIsAddModalOpen(false)} />
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          listId={listId}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}

export default ListDetailPage
