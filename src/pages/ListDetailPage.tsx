import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useItems } from '@/features/items/hooks/useItems'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useListStore } from '@/store/listStore'
import { useSignalR } from '@/hooks/useSignalR'
import { ROUTES } from '@/router/routes'
import styles from './ListDetailPage.module.css'

const CATEGORY_ICONS: Record<string, { icon: string; bg: string }> = {
  salon: { icon: '🛋️', bg: '#E8F0EA' },
  'yatak odası': { icon: '🛏️', bg: '#E8EDF5' },
  mutfak: { icon: '🍳', bg: '#F5E8E8' },
  banyo: { icon: '🚿', bg: '#E8F5F0' },
  'çocuk odası': { icon: '🧸', bg: '#F5F0E8' },
  default: { icon: '📦', bg: '#F0F0EE' },
}

const getCategoryStyle = (name: string) =>
  CATEGORY_ICONS[name.toLowerCase()] ?? CATEGORY_ICONS.default

const FinancialIcon = () => (
  <div style={{
    width: 36, height: 36, borderRadius: 8,
    background: 'var(--color-primary-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="4" width="16" height="11" rx="2" stroke="var(--color-primary)" strokeWidth="1.4"/>
      <path d="M1 7.5h16" stroke="var(--color-primary)" strokeWidth="1.4"/>
      <circle cx="5" cy="11" r="1" fill="var(--color-primary)"/>
    </svg>
  </div>
)

const ListDetailPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const setActiveListId = useListStore((s) => s.setActiveListId)
  if (listId) setActiveListId(listId)

  const { data: listDetail } = useListDetail(listId ?? '')
  const { data: allItems, isLoading: itemsLoading } = useItems(listId ?? '', 'All')
  const { data: categories, isLoading: catsLoading } = useCategories(listId ?? '')

  useSignalR()

  const totalCount = allItems?.length ?? 0
  const purchasedCount = allItems?.filter((i) => i.status === 'Purchased').length ?? 0
  const pendingCount = totalCount - purchasedCount
  const completionPct = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0

  const categoryStats = useMemo(() => {
    if (!allItems || !categories) return []
    return categories.map((cat) => {
      const catItems = allItems.filter((i) => i.categoryId === cat.id)
      const catPurchased = catItems.filter((i) => i.status === 'Purchased').length
      const pct = catItems.length > 0 ? Math.round((catPurchased / catItems.length) * 100) : 0
      return { cat, total: catItems.length, purchased: catPurchased, pct }
    })
  }, [allItems, categories])

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  const isLoading = itemsLoading || catsLoading

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>PROJE DURUMU</span>
          <h1 className={styles.title}>{listDetail?.name ?? '—'}</h1>
          <p className={styles.subtitle}>Birlikte Planlayın</p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.progressLabel}>Genel İlerleme %{completionPct}</span>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* Financial + Claims */}
      <div className={styles.twoCol}>
        <div className={styles.financialCard}>
          <div className={styles.financialCardTop}>
            <p className={styles.cardEyebrow}>FİNANSAL ÖZET</p>
            <FinancialIcon />
          </div>
          <h2 className={styles.financialTitle}>Tahmini Toplam Bütçe</h2>
          <p className={styles.financialSub}>Toplam Hedef</p>
          <div className={styles.bigNumber}>₺ —</div>
          <div className={styles.financialInner}>
            <span className={styles.financialInnerLabel}>Harcanan Toplam</span>
            <span className={styles.financialInnerValue}>₺ —</span>
          </div>
        </div>

        <div className={styles.claimsCard}>
          <div className={styles.claimsHeader}>
            <span className={styles.claimsTitle}>Bekleyen Talepler</span>
            {pendingCount > 0 && (
              <span className={styles.newBadge}>{pendingCount} Yeni</span>
            )}
          </div>
          <div
            className={styles.claimRow}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(ROUTES.ITEM_LIST_WITH_ID(listId))}
          >
            <div className={styles.claimLeft}>
              <div className={styles.claimIcon}>📋</div>
              <div>
                <div className={styles.claimName}>İtem Listesi</div>
                <div className={styles.claimDesc}>{totalCount} ürün · {pendingCount} bekliyor</div>
              </div>
            </div>
            <button className={styles.inspectBtn}>İncele</button>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Proje Özeti</span>
        <button
          className={styles.allDetailsBtn}
          onClick={() => navigate(ROUTES.ITEM_LIST_WITH_ID(listId))}
        >
          TÜM DETAYLAR →
        </button>
      </div>

      {isLoading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : (
        <div className={styles.categoryGrid}>
          {categoryStats.map(({ cat, total, pct }) => {
            const { icon, bg } = getCategoryStyle(cat.name)
            const avatarCount = Math.min(total, 3)
            return (
              <div
                key={cat.id}
                className={styles.categoryCard}
                onClick={() => navigate(ROUTES.ITEM_LIST_WITH_ID(listId))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.ITEM_LIST_WITH_ID(listId))}
              >
                <div className={styles.categoryCardTop}>
                  <div className={styles.categoryIcon} style={{ background: bg }}>{icon}</div>
                  <span className={styles.categoryPct}>{pct}% Tamam</span>
                </div>
                <div className={styles.categoryName}>{cat.name}</div>
                <div className={styles.categoryDesc}>{total} ürün</div>
                {avatarCount > 0 && (
                  <div className={styles.categoryAvatars}>
                    {Array.from({ length: avatarCount }).map((_, i) => (
                      <div key={i} className={styles.categoryAvatar}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <button className={styles.fab} onClick={() => navigate(ROUTES.NEW_ITEM_WITH_ID(listId ?? ''))}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Yeni Kalem Ekle
      </button>

    </div>
  )
}

export default ListDetailPage
