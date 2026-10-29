import StatusFilter from '@/features/items/components/StatusFilter'
import CategoryFilter from '@/features/categories/components/CategoryFilter'
import type { StatusFilter as StatusFilterType } from '@/features/items/types'
import styles from './ReportFilters.module.css'

interface Props {
  listId: string
  status: StatusFilterType
  categoryId: string | null
  roomLabels: string[]
  roomLabel: string | null
  search: string
  onStatusChange: (status: StatusFilterType) => void
  onCategoryChange: (categoryId: string | null) => void
  onRoomLabelChange: (roomLabel: string | null) => void
  onSearchChange: (search: string) => void
}

const ReportFilters = ({
  listId,
  status,
  categoryId,
  roomLabels,
  roomLabel,
  search,
  onStatusChange,
  onCategoryChange,
  onRoomLabelChange,
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
    {roomLabels.length > 1 && (
      <div className={styles.chipRow} role="group" aria-label="Oda filtresi">
        <span className={styles.chipLabel}>Oda</span>
        <button
          type="button"
          className={`${styles.chip} ${roomLabel === null ? styles.chipActive : ''}`}
          onClick={() => onRoomLabelChange(null)}
        >
          Tümü
        </button>
        {roomLabels.map((label) => (
          <button
            key={label}
            type="button"
            className={`${styles.chip} ${roomLabel === label ? styles.chipActive : ''}`}
            onClick={() => onRoomLabelChange(label)}
          >
            {label}
          </button>
        ))}
      </div>
    )}
    <CategoryFilter listId={listId} selectedCategoryId={categoryId} onChange={onCategoryChange} />
  </div>
)

export default ReportFilters
