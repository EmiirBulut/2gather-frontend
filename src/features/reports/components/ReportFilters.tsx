import StatusFilter from '@/features/items/components/StatusFilter'
import CategoryFilter from '@/features/categories/components/CategoryFilter'
import type { StatusFilter as StatusFilterType } from '@/features/items/types'
import styles from './ReportFilters.module.css'

interface Props {
  listId: string
  status: StatusFilterType
  categoryId: string | null
  search: string
  onStatusChange: (status: StatusFilterType) => void
  onCategoryChange: (categoryId: string | null) => void
  onSearchChange: (search: string) => void
}

const ReportFilters = ({
  listId,
  status,
  categoryId,
  search,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
}: Props) => (
  <div className={styles.filters}>
    <div className={styles.topRow}>
      <StatusFilter value={status} onChange={onStatusChange} />
      <input
        type="search"
        className={styles.searchInput}
        placeholder="İtem adına göre ara…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="İtem adına göre ara"
      />
    </div>
    <CategoryFilter listId={listId} selectedCategoryId={categoryId} onChange={onCategoryChange} />
  </div>
)

export default ReportFilters
