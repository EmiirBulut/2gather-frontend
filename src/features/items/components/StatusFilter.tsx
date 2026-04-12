import type { StatusFilter as StatusFilterType } from '../types'
import styles from './StatusFilter.module.css'

interface Props {
  value: StatusFilterType
  onChange: (value: StatusFilterType) => void
  pendingCount?: number
  purchasedCount?: number
}

const OPTIONS: { label: string; value: StatusFilterType }[] = [
  { label: 'Bekleyenler', value: 'Pending' },
  { label: 'Tamamlananlar', value: 'Purchased' },
  { label: 'Tümü', value: 'All' },
]

const StatusFilter = ({ value, onChange, pendingCount, purchasedCount }: Props) => {
  return (
    <div className={styles.wrapper}>
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value
        const count =
          opt.value === 'Pending' ? pendingCount :
          opt.value === 'Purchased' ? purchasedCount :
          undefined

        return (
          <button
            key={opt.value}
            className={`${styles.chip} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {isActive && <span className={styles.dot} />}
            {opt.label}
            {count !== undefined && ` (${count})`}
          </button>
        )
      })}
    </div>
  )
}

export default StatusFilter
