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

  const roleLabel = list.currentUserRole === 0 ? 'SAHİP' : list.currentUserRole === 1 ? 'EDİTÖR' : 'İZLEYİCİ'
  const roleBadgeClass = list.currentUserRole === 0 ? styles.roleBadgeOwner : styles.roleBadgeEditor

  const progressPct = Math.round(list.completionPercentage)
  const itemLabel = `${list.purchasedItemCount}/${list.totalItemCount} öğe`

  if (!isOwner) {
    return (
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <span className={`${styles.roleBadge} ${roleBadgeClass}`}>{roleLabel}</span>
        </div>

        <h3 className={styles.cardName}>{list.name}</h3>

        <div className={styles.invitedStats}>
          <span className={styles.invitedStat}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 11c0-2 1.8-3 4-3s4 1 4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="9.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M11 11c0-1.5-1-2.2-2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {list.memberCount} üye
          </span>
          <span className={styles.invitedStat}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="2" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6h5M4 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {itemLabel}
          </span>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>İLERLEME</span>
            <span className={styles.progressPct}>%{progressPct}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <button className={styles.viewBtn} onClick={handleClick}>PROJEYİ GÖRÜNTÜLE</button>
      </div>
    )
  }

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.cardTop}>
        <span className={`${styles.roleBadge} ${roleBadgeClass}`}>{roleLabel}</span>
        <button
          className={styles.menuBtn}
          onClick={handleDelete}
          aria-label={`${list.name} listesini sil`}
        >
          ···
        </button>
      </div>

      <h3 className={styles.cardName}>{list.name}</h3>

      <div className={styles.metaRow}>
        <div className={styles.metaBox}>
          <div className={styles.metaLabel}>ÜYELER</div>
          <div className={styles.avatarStack}>
            {list.members.map((m) => (
              <div key={m.userId} className={styles.avatar} title={m.displayName}>
                {m.initials}
              </div>
            ))}
            {list.memberCount > 3 && (
              <div className={styles.avatar}>+{list.memberCount - 3}</div>
            )}
          </div>
        </div>
        <div className={styles.metaBox}>
          <div className={styles.metaLabel}>İLERLEME</div>
          <div className={styles.metaValue}>{itemLabel}</div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>TAMAMLANMA</span>
          <span className={styles.progressPct}>%{progressPct}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </div>
  )
}

export default ListCard
