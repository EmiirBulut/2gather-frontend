import { useParams, useNavigate } from 'react-router-dom'
import { useReportsSummary, useCategoryReport } from '@/features/reports/hooks/useReports'
import { useItems } from '@/features/items/hooks/useItems'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { formatPrice } from '@/lib/formatters'
import { ROUTES } from '@/router/routes'
import styles from './ReportsPage.module.css'

const CATEGORY_ICON: Record<string, string> = {
  salon: '🛋️',
  'yatak odası': '🛏️',
  mutfak: '🍳',
  banyo: '🚿',
  'çocuk odası': '🧸',
}
const getCategoryIcon = (name: string) => CATEGORY_ICON[name.toLowerCase()] ?? '📦'

const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 12L14 4l10 8v12a1 1 0 01-1 1H5a1 1 0 01-1-1V12z"
      stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 25v-8h8v8" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const ReportsPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()

  const { data: listDetail } = useListDetail(listId ?? '')
  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useReportsSummary(listId ?? '')
  const { data: categories, isLoading: isCatLoading, isError: isCatError } = useCategoryReport(listId ?? '')
  const { data: items, isLoading: isItemsLoading } = useItems(listId ?? '', 'All')

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  const listName = listDetail?.name ?? '—'

  const completionPct = summary && summary.totalItems > 0
    ? Math.round((summary.purchasedCount / summary.totalItems) * 100)
    : 0

  const budgetUsedPct = summary && summary.estimatedTotal > 0
    ? Math.round((summary.totalSpent / summary.estimatedTotal) * 100)
    : 0

  const remaining = summary ? summary.estimatedTotal - summary.totalSpent : 0

  return (
    <div className={styles.page}>
      <Breadcrumb items={[
        { label: listName, href: ROUTES.LIST_DETAIL_WITH_ID(listId) },
        { label: 'Raporlar' },
      ]} />

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>ANALİZ &amp; GÖRÜNÜM</p>
          <h1 className={styles.title}>Raporlar</h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>Dışa Aktar</button>
          <button className={styles.shareBtn}>Paylaş</button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      {isSummaryError && (
        <p className={styles.errorText}>Özet verisi yüklenemedi.</p>
      )}
      {isSummaryLoading ? (
        <div className={styles.skeleton} style={{ height: 180 }} />
      ) : summary && (
        <div className={styles.summaryRow}>
          {/* Finansal Özet */}
          <div className={styles.financialCard}>
            <p className={styles.cardEyebrow}>Finansal Özet</p>
            <div className={styles.financialMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>BÜTÇE</span>
                <span className={styles.metricValue}>{formatPrice(summary.estimatedTotal)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>HARCANAN</span>
                <span className={styles.metricValue}>{formatPrice(summary.totalSpent)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>KALAN ÖNET</span>
                <span className={styles.metricValue}>{formatPrice(remaining)}</span>
              </div>
            </div>

            <div className={styles.budgetProgress}>
              <div className={styles.budgetProgressRow}>
                <span className={styles.budgetLabel}>Bütçe Kullanımı</span>
                <span className={styles.budgetPct}>{budgetUsedPct}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${budgetUsedPct}%` }} />
              </div>
            </div>

            {/* Category breakdown */}
            {!isCatLoading && categories && categories.length > 0 && (
              <div className={styles.catBreakdown}>
                {categories.map((cat) => {
                  const pct = cat.totalItems > 0
                    ? Math.round((cat.purchasedCount / cat.totalItems) * 100)
                    : 0
                  return (
                    <div key={cat.categoryId} className={styles.catRow}>
                      <span className={styles.catName}>{cat.categoryName}</span>
                      <div className={styles.catBar}>
                        <div className={styles.catBarFill} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={styles.catPct}>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Hazırlık Durumu */}
          <div className={styles.readinessCard}>
            <div className={styles.readinessIcon}><HomeIcon /></div>
            <p className={styles.readinessText}>
              Eviniz hazırlanma sürecinde harika ilerleme kaydediyor.
            </p>
            <p className={styles.readinessPct}>{completionPct}%</p>
            <p className={styles.readinessLabel}>TAMAMLANMA ORANI</p>
          </div>
        </div>
      )}

      {/* ── İtem Listesi & Durum ── */}
      <div className={styles.tableSection}>
        <div className={styles.tableSectionHeader}>
          <h2 className={styles.sectionTitle}>İtem Listesi &amp; Durum</h2>
          <div className={styles.legend}>
            <span className={styles.legendDot} data-type="purchased" />
            <span className={styles.legendLabel}>Satın Alındı</span>
            <span className={styles.legendDot} data-type="pending" />
            <span className={styles.legendLabel}>Bekliyor</span>
          </div>
        </div>

        {isCatError && (
          <p className={styles.errorText}>İtem verisi yüklenemedi.</p>
        )}

        {isItemsLoading ? (
          <div className={styles.skeleton} style={{ height: 200 }} />
        ) : items && items.length > 0 ? (
          <div className={styles.tableWrapper}>
            <div className={styles.tableHead}>
              <span className={styles.colImage}>GÖRSEL</span>
              <span className={styles.colName}>İTEM ADI</span>
              <span className={styles.colCategory}>KATEGORİ</span>
              <span className={styles.colPrice}>TAHMİNİ FİYAT</span>
              <span className={styles.colStatus}>DURUM</span>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className={styles.tableRow}
                onClick={() => navigate(ROUTES.ITEM_DETAIL_WITH_ID(listId, item.id), { state: { item } })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.ITEM_DETAIL_WITH_ID(listId, item.id), { state: { item } })}
              >
                <span className={styles.colImage}>
                  <span className={styles.itemEmoji}>{getCategoryIcon(item.categoryName)}</span>
                </span>
                <span className={styles.colName}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemSub}>{item.optionsCount} seçenek</span>
                </span>
                <span className={styles.colCategory}>
                  <span className={styles.categoryBadge}>{item.categoryName}</span>
                </span>
                <span className={styles.colPrice}>—</span>
                <span className={styles.colStatus}>
                  <span className={`${styles.statusBadge} ${item.status === 'Purchased' ? styles.statusPurchased : styles.statusPending}`}>
                    {item.status === 'Purchased' ? 'Satın Alındı' : 'Bekliyor'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : !isItemsLoading && (
          <p className={styles.emptyText}>Henüz ürün eklenmemiş.</p>
        )}
      </div>

      <div className={styles.watermark}>
        <span>{listName.toUpperCase()}</span><br />
        <span>RAPORLAR / {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}

export default ReportsPage
