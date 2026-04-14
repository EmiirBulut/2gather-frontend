import { useReviewClaim } from '../hooks/useReviewClaim'
import type { ItemOptionDto } from '@/features/options/types'
import styles from './PendingClaimsPanel.module.css'

interface Props {
  itemId: string
  options: ItemOptionDto[]
}

const PendingClaimsPanel = ({ itemId, options }: Props) => {
  const { mutate: reviewClaim, isPending } = useReviewClaim(itemId)

  // Aggregate all pending claims (status=0) across all options
  const pendingClaims = options.flatMap((opt) =>
    opt.claims
      .filter((c) => c.status === 0)
      .map((c) => ({ ...c, optionTitle: opt.title, optionId: opt.id }))
  )

  if (pendingClaims.length === 0) return null

  return (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>Bekleyen Talepler</p>
      <div className={styles.list}>
        {pendingClaims.map((claim) => (
          <div key={claim.id} className={styles.row}>
            <div className={styles.info}>
              <span className={styles.claimant}>{claim.displayName}</span>
              <span className={styles.meta}>
                {claim.optionTitle} · %{claim.percentage}
              </span>
            </div>
            <div className={styles.btns}>
              <button
                className={`${styles.reviewBtn} ${styles.approve}`}
                onClick={() =>
                  reviewClaim({ claimId: claim.id, optionId: claim.optionId, decision: 1 })
                }
                disabled={isPending}
              >
                Onayla
              </button>
              <button
                className={`${styles.reviewBtn} ${styles.reject}`}
                onClick={() =>
                  reviewClaim({ claimId: claim.id, optionId: claim.optionId, decision: 2 })
                }
                disabled={isPending}
              >
                Reddet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingClaimsPanel
