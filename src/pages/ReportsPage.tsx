import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReportsSummary, useCategoryReport, useReportItems } from '@/features/reports/hooks/useReports'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import SegmentedProgressBar from '@/components/ui/SegmentedProgressBar'
import ReportFilters from '@/features/reports/components/ReportFilters'
import ReportItemTable from '@/features/reports/components/ReportItemTable'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { ReportItemDto } from '@/features/reports/types'
import type { StatusFilter } from '@/features/items/types'
import { formatPrice } from '@/lib/formatters'
import { ROUTES } from '@/router/routes'
import styles from './ReportsPage.module.css'

interface ReportItemFilters {
  status: StatusFilter
  categoryId: string | null
  search: string
}

const filterReportItems = (
  items: ReportItemDto[],
  { status, categoryId, search }: ReportItemFilters
): ReportItemDto[] => {
  const query = search.trim().toLocaleLowerCase('tr-TR')
  return items.filter((item) =>
    (status === 'All' || item.status === status) &&
    (categoryId === null || item.categoryId === categoryId) &&
    (query === '' || item.name.toLocaleLowerCase('tr-TR').includes(query))
  )
}

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
  const { data: items, isLoading: isItemsLoading, isError: isItemsError } = useReportItems(listId ?? '')

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

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

  const filteredItems = filterReportItems(items ?? [], {
    status: statusFilter,
    categoryId: categoryFilter,
    search: debouncedSearch,
  })

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
                {categories.map((cat) => (
                  <div key={cat.categoryId} className={styles.catRow}>
                    <div className={styles.catRowHeader}>
                      <span className={styles.catName}>{cat.categoryName}</span>
                      <span className={styles.catPct}>
                        {cat.totalItems > 0
                          ? Math.round((cat.purchasedCount / cat.totalItems) * 100)
                          : 0}%
                      </span>
                    </div>
                    <SegmentedProgressBar
                      total={cat.totalItems}
                      completed={cat.purchasedCount}
                    />
                    <span className={styles.catSub}>
                      {cat.purchasedCount}/{cat.totalItems} İTEM ALINDI
                    </span>
                  </div>
                ))}
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

        {(isCatError || isItemsError) && (
          <p className={styles.errorText}>İtem verisi yüklenemedi.</p>
        )}

        {isItemsLoading ? (
          <div className={styles.skeleton} style={{ height: 200 }} />
        ) : items && items.length > 0 ? (
          <>
            <ReportFilters
              listId={listId}
              status={statusFilter}
              categoryId={categoryFilter}
              search={search}
              onStatusChange={setStatusFilter}
              onCategoryChange={setCategoryFilter}
              onSearchChange={setSearch}
            />
            {filteredItems.length > 0 ? (
              <ReportItemTable listId={listId} items={filteredItems} />
            ) : (
              <p className={styles.emptyText}>Filtrelere uygun ürün bulunamadı.</p>
            )}
          </>
        ) : !isItemsError && (
          <p className={styles.emptyText}>Henüz ürün eklenmemiş.</p>
        )}
      </div>

      <div className={styles.pageFooter}>
        <span>— DESIGN FOR COLLECTIVE PLANNING</span>
        <span>2gather Reports v2.4 — {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}

export default ReportsPage
