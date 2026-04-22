import { usePendingInvites, useCancelInvite, useResendInvite } from '../hooks/useInvites'
import { formatRelativeTime } from '@/lib/formatters'
import type { PendingInviteDto } from '../types'
import styles from './PendingInviteList.module.css'

const ROLE_LABELS: Record<PendingInviteDto['role'], string> = {
  Owner: 'SAHİP',
  Editor: 'EDİTÖR',
  Viewer: 'İZLEYİCİ',
}

interface Props {
  listId: string
}

const PendingInviteList = ({ listId }: Props) => {
  const { data: invites, isLoading } = usePendingInvites(listId)
  const { mutate: cancel, isPending: isCancelling } = useCancelInvite(listId)
  const { mutate: resend, isPending: isResending } = useResendInvite(listId)

  if (isLoading || !invites?.length) return null

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Bekleyen Davetler</h2>
      <div className={styles.list}>
        {invites.map((invite: PendingInviteDto) => (
          <div key={invite.inviteId} className={`${styles.row} ${invite.isExpired ? styles.rowExpired : ''}`}>
            <div className={styles.iconCircle}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </div>

            <div className={styles.info}>
              <span className={styles.email}>{invite.invitedEmail}</span>
              <span className={styles.meta}>
                {invite.isExpired ? 'Süresi doldu' : `${formatRelativeTime(invite.createdAt)} gönderildi`}
              </span>
            </div>

            <span className={`${styles.roleBadge} ${styles[`role${invite.role}`]}`}>
              {ROLE_LABELS[invite.role]}
            </span>

            <button
              className={styles.resendBtn}
              onClick={() => resend(invite.inviteId)}
              disabled={isResending}
              title="Yeniden gönder"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7a5 5 0 105-5H5M5 2L2 5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className={styles.cancelBtn}
              onClick={() => cancel(invite.inviteId)}
              disabled={isCancelling}
              title="İptal et"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingInviteList
