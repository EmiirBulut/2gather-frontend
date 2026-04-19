import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import type { ListSummaryDto } from '../types'
import styles from './ListCard.module.css'

interface Props {
  list: ListSummaryDto
  isOwner: boolean
  onDelete: (id: string) => void
}

const ListCard = ({ list, isOwner, onDelete }: Props) => {
  const navigate = useNavigate()

  const handleClick = () => navigate(ROUTES.LIST_DETAIL_WITH_ID(list.id))

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(list.id)
  }

  const avatarCount = Math.min(list.memberCount, 3)

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.cardTop}>
        <span className={`${styles.roleBadge} ${isOwner ? styles.roleBadgeOwner : styles.roleBadgeEditor}`}>
          {isOwner ? 'SAHİP' : 'EDİTÖR'}
        </span>
        {isOwner && (
          <button
            className={styles.menuBtn}
            onClick={handleDelete}
            aria-label={`${list.name} listesini sil`}
          >
            ···
          </button>
        )}
      </div>

      <h3 className={styles.cardName}>{list.name}</h3>

      <div className={styles.metaRow}>
        <div className={styles.metaBox}>
          <div className={styles.metaLabel}>Üyeler</div>
          <div className={styles.avatarStack}>
            {Array.from({ length: avatarCount }).map((_, i) => (
              <div key={i} className={styles.avatar}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.metaBox}>
          <div className={styles.metaLabel}>İlerleme</div>
          <div className={styles.metaValue}>{list.memberCount} üye</div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Tamamlanma</span>
          <span className={styles.progressPct}>0%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  )
}

export default ListCard
