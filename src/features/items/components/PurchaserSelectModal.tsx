import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import { useMembers } from '@/features/members/hooks/useMembers'
import { useMarkPurchased } from '../hooks/useMarkPurchased'
import { getErrorMessage } from '@/services/api'
import styles from './PurchaserSelectModal.module.css'

const schema = z.object({
  purchaserUserIds: z.array(z.string()).min(1, 'En az bir kişi seçin'),
})

type FormValues = z.infer<typeof schema>

const PURCHASE_ERROR = 'Satın alma kaydedilemedi. Lütfen tekrar deneyin.'

interface Props {
  listId: string
  itemId: string
  defaultPurchaserIds: string[]
  onClose: () => void
  onSuccess: () => void
}

const PurchaserSelectModal = ({ listId, itemId, defaultPurchaserIds, onClose, onSuccess }: Props) => {
  const { data: members, isLoading: isMembersLoading, isError: isMembersError } = useMembers(listId)
  const { mutate: markPurchased, isPending, error } = useMarkPurchased()

  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { purchaserUserIds: defaultPurchaserIds },
  })

  const onSubmit = ({ purchaserUserIds }: FormValues) => {
    markPurchased({ itemId, listId, purchaserUserIds }, { onSuccess })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // 403 carries a user-facing message from useMarkPurchased; anything else gets a generic one
  const errorMessage = error?.statusCode === 403 ? error.message : getErrorMessage(error, PURCHASE_ERROR)

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchaser-title"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.header}>
          <h3 className={styles.title} id="purchaser-title">Kim satın aldı?</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className={styles.hint}>Bu ürünü satın alan kişileri seçin. Birden fazla kişi seçebilirsiniz.</p>

        {isMembersLoading && <p className={styles.hint}>Üyeler yükleniyor…</p>}
        {isMembersError && <p className={styles.errorText}>Üye listesi yüklenemedi.</p>}

        {members && (
          <Controller
            name="purchaserUserIds"
            control={control}
            render={({ field }) => (
              <div className={styles.memberList}>
                {members.map(({ userId, displayName }) => {
                  const isChecked = field.value.includes(userId)
                  const handleToggle = () =>
                    field.onChange(
                      isChecked ? field.value.filter((id) => id !== userId) : [...field.value, userId]
                    )
                  return (
                    <label
                      key={userId}
                      className={`${styles.memberRow} ${isChecked ? styles.memberRowChecked : ''}`}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isChecked}
                        onChange={handleToggle}
                      />
                      <span className={styles.memberName}>{displayName}</span>
                    </label>
                  )
                })}
              </div>
            )}
          />
        )}

        {errors.purchaserUserIds && (
          <p className={styles.errorText}>{errors.purchaserUserIds.message}</p>
        )}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <div className={styles.actions}>
          <Button variant="ghost" type="button" onClick={onClose}>İptal</Button>
          <Button type="submit" isLoading={isPending} disabled={!members}>
            Satın Alındı Olarak İşaretle
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PurchaserSelectModal
