import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import type { ListSummaryDto } from '../types'
import styles from './ListCard.module.css'

interface Props {
  list: ListSummaryDto
  onDelete: (id: string) => void
  canDelete: boolean
}

const ListCard = ({ list, onDelete, canDelete }: Props) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(ROUTES.LIST_DETAIL_WITH_ID(list.id))
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(list.id)
  }

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className={styles.header}>
        <h3 className={styles.name}>{list.name}</h3>
        {canDelete && (
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            aria-label={`${list.name} listesini sil`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h9.334Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.memberCount}>
          <div className={styles.memberDots}>
            <div className={styles.memberDot}>
              {list.memberCount}
            </div>
          </div>
          <span>{list.memberCount} üye</span>
        </div>
      </div>
    </div>
  )
}

export default ListCard
