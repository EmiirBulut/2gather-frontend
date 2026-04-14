import { useState } from 'react'
import { useCreateClaim } from '../hooks/useCreateClaim'
import Button from '@/components/ui/Button'
import type { ClaimPercentage } from '../types'
import styles from './ClaimModal.module.css'

const PERCENTAGES: ClaimPercentage[] = [25, 50, 75, 100]

interface Props {
  optionId: string
  itemId: string
  remaining: number
  onClose: () => void
}

const ClaimModal = ({ optionId, itemId, remaining, onClose }: Props) => {
  const [selected, setSelected] = useState<ClaimPercentage | null>(null)
  const { mutate: createClaim, isPending, error } = useCreateClaim(itemId)

  const handleSubmit = () => {
    if (!selected) return
    createClaim(
      { optionId, percentage: selected },
      { onSuccess: () => onClose() }
    )
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="claim-title">
        <div className={styles.header}>
          <h3 className={styles.title} id="claim-title">Talip Ol</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className={styles.remainingInfo}>
          Talip olunabilecek maksimum: <strong>%{remaining}</strong>
        </p>

        <div className={styles.percentageGrid}>
          {PERCENTAGES.map((pct) => (
            <button
              key={pct}
              className={`${styles.pctBtn} ${selected === pct ? styles.pctSelected : ''}`}
              onClick={() => setSelected(pct)}
              disabled={pct > remaining}
            >
              %{pct}
            </button>
          ))}
        </div>

        {error && (
          <p className={styles.errorText}>{error.message}</p>
        )}

        <div className={styles.actions}>
          <Button variant="ghost" type="button" onClick={onClose}>İptal</Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            isLoading={isPending}
          >
            Talip Ol
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ClaimModal
