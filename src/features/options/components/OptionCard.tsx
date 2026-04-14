import { useState } from 'react'
import { useSelectOption } from '../hooks/useSelectOption'
import { useDeleteOption } from '../hooks/useDeleteOption'
import { useUpdateOption } from '../hooks/useUpdateOption'
import { formatPrice } from '@/lib/formatters'
import OptionForm from './OptionForm'
import type { ItemOptionDto, UpdateOptionRequest } from '../types'
import styles from './OptionCard.module.css'

interface Props {
  option: ItemOptionDto
  canEdit: boolean
}

const OptionCard = ({ option, canEdit }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { mutate: handleSelect } = useSelectOption(option.itemId)
  const { mutate: handleDelete, isPending: isDeleting } = useDeleteOption(option.itemId)
  const { mutate: handleUpdate, isPending: isUpdating, error: updateError } = useUpdateOption(option.itemId)

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (canEdit) handleSelect(option.id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`"${option.title}" seçeneğini silmek istiyor musunuz?`)) {
      handleDelete(option.id)
    }
  }

  const handleEditSubmit = (data: UpdateOptionRequest) => {
    handleUpdate(
      { id: option.id, data },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  return (
    <div className={`${styles.card} ${option.isSelected ? styles.isSelected : ''}`}>
      <div className={styles.header}>
        {/* Select radio */}
        <button
          className={`${styles.selectBtn} ${option.isSelected ? styles.selected : ''}`}
          onClick={handleSelectClick}
          disabled={!canEdit}
          aria-label={option.isSelected ? 'Seçili' : 'Bu seçeneği seç'}
          title={canEdit ? 'Bu seçeneği seç' : 'Düzenleme yetkiniz yok'}
        >
          {option.isSelected && <span className={styles.selectDot} />}
        </button>

        {/* Info */}
        <div className={styles.info}>
          <p className={styles.title}>{option.title}</p>
          {option.link && (
            <a
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7M7.5 1H11m0 0v3.5M11 1 5.5 6.5"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Bağlantıyı Aç
            </a>
          )}
        </div>

        {/* Price */}
        {option.price != null && (
          <span className={styles.price}>
            {formatPrice(option.price)}
          </span>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {(option.notes || option.brand || option.model || option.color) && (
            <button
              className={styles.actionBtn}
              onClick={() => setIsExpanded((v) => !v)}
              aria-label={isExpanded ? 'Detayları gizle' : 'Detayları göster'}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1.5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 5v4m0-6.5v.5"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          )}
          {canEdit && (
            <>
              <button
                className={styles.actionBtn}
                onClick={() => setIsEditing((v) => !v)}
                aria-label="Düzenle"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9.5 2.5 11.5 4.5 4.5 11.5H2.5v-2L9.5 2.5z"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className={`${styles.actionBtn} ${styles.danger}`}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-label="Sil"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.75 3.5h10.5M5.25 3.5V2.333a.583.583 0 0 1 .583-.583h2.334a.583.583 0 0 1 .583.583V3.5m1.75 0v7.583a.583.583 0 0 1-.583.584H4.083a.583.583 0 0 1-.583-.584V3.5h8.167Z"
                    stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className={styles.details}>
          {(option.brand || option.model || option.color) && (
            <div className={styles.detailGrid}>
              {option.brand && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Marka</span>
                  <span className={styles.detailValue}>{option.brand}</span>
                </div>
              )}
              {option.model && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Model</span>
                  <span className={styles.detailValue}>{option.model}</span>
                </div>
              )}
              {option.color && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Renk</span>
                  <span className={styles.detailValue}>{option.color}</span>
                </div>
              )}
            </div>
          )}
          {option.notes && (
            <p className={styles.notes}>{option.notes}</p>
          )}
        </div>
      )}

      {/* Edit form */}
      {isEditing && (
        <div className={styles.editForm}>
          <OptionForm
            itemId={option.itemId}
            existing={option}
            isPending={isUpdating}
            error={updateError?.message ?? null}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  )
}

export default OptionCard
