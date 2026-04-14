import { useState } from 'react'
import ClaimModal from './ClaimModal'
import type { ClaimDto, BackendClaimStatus } from '@/features/options/types'
import styles from './ClaimSection.module.css'

const STATUS_LABELS: Record<BackendClaimStatus, string> = {
  0: 'Bekliyor',
  1: 'Onaylandı',
  2: 'Reddedildi',
}

const STATUS_MOD: Record<BackendClaimStatus, string> = {
  0: styles.statusPending,
  1: styles.statusApproved,
  2: styles.statusRejected,
}

interface Props {
  optionId: string
  itemId: string
  claims: ClaimDto[]
  approvedClaimsTotal: number
  remainingClaimPercentage: number
  canEdit: boolean
  isPurchased: boolean
}

const ClaimSection = ({
  optionId,
  itemId,
  claims,
  approvedClaimsTotal,
  remainingClaimPercentage,
  canEdit,
  isPurchased,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showClaimBtn = canEdit && !isPurchased && remainingClaimPercentage > 0

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Talipler</span>
        {showClaimBtn && (
          <button className={styles.claimBtn} onClick={() => setIsModalOpen(true)}>
            + Talip Ol
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.progressRow}>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${approvedClaimsTotal}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          {approvedClaimsTotal}% onaylı · %{remainingClaimPercentage} kaldı
        </span>
      </div>

      {/* Claims list */}
      {claims.length > 0 && (
        <div className={styles.claimList}>
          {claims.map((claim) => (
            <div key={claim.id} className={styles.claimRow}>
              <span className={styles.claimName}>{claim.displayName}</span>
              <span className={styles.claimPct}>%{claim.percentage}</span>
              <span className={`${styles.statusBadge} ${STATUS_MOD[claim.status]}`}>
                {STATUS_LABELS[claim.status]}
              </span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ClaimModal
          optionId={optionId}
          itemId={itemId}
          remaining={remainingClaimPercentage}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ClaimSection
