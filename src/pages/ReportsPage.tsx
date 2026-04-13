import { useParams, useNavigate } from 'react-router-dom'
import { useReportsSummary, useCategoryReport } from '@/features/reports/hooks/useReports'
import SummaryCards from '@/features/reports/components/SummaryCards'
import CategoryTable from '@/features/reports/components/CategoryTable'
import SpendingChart from '@/features/reports/components/SpendingChart'
import { ROUTES } from '@/router/routes'
import styles from './ReportsPage.module.css'

const ReportsPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()

  const { data: summary, isLoading: isSummaryLoading, isError: isSummaryError } = useReportsSummary(listId ?? '')
  const { data: categories, isLoading: isCatLoading, isError: isCatError } = useCategoryReport(listId ?? '')

  const handleBack = () => navigate(ROUTES.LIST_DETAIL_WITH_ID(listId ?? ''))

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <button className={styles.backBtn} onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12 6 8l4-4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Listeye Dön
        </button>
        <div className={styles.navLogoMark}>2G</div>
      </nav>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Analiz</p>
          <h1 className={styles.heroTitle}>Rapor</h1>
        </div>
      </div>

      <main className={styles.main}>

        {/* Summary */}
        <section className={styles.section}>
          {isSummaryLoading && (
            <div className={styles.skeleton} style={{ height: 200 }} />
          )}
          {isSummaryError && (
            <p className={styles.errorText}>Özet verisi yüklenemedi.</p>
          )}
          {summary && <SummaryCards data={summary} />}
        </section>

        {/* Chart */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Kategoriye Göre</span>
          </div>
          {isCatLoading && (
            <div className={styles.skeleton} style={{ height: 220 }} />
          )}
          {isCatError && (
            <p className={styles.errorText}>Kategori verisi yüklenemedi.</p>
          )}
          {categories && <SpendingChart data={categories} />}
        </section>

        {/* Table */}
        {categories && categories.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Detay Tablosu</span>
            </div>
            <CategoryTable data={categories} />
          </section>
        )}

      </main>
    </div>
  )
}

export default ReportsPage
