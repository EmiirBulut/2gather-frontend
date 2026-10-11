import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import { useMembers } from '@/features/members/hooks/useMembers'
import { useMarkPurchased } from '../hooks/useMarkPurchased'
import { formatPrice } from '@/lib/formatters'
import type { ItemOptionDto } from '@/features/options/types'
import { getErrorMessage } from '@/services/api'
import styles from './PurchaserSelectModal.module.css'

const createSchema = (hasOptions: boolean) =>
  z
    .object({
      purchaserUserIds: z.array(z.string()).min(1, 'En az bir kişi seçin'),
      purchasedOptionId: z.string().optional(),
    })
    .refine(({ purchasedOptionId }) => !hasOptions || Boolean(purchasedOptionId), {
      message: 'Hangi seçeneğin alındığını seçin',
      path: ['purchasedOptionId'],
    })

type FormValues = z.infer<ReturnType<typeof createSchema>>

const PURCHASE_ERROR = 'Satın alma kaydedilemedi. Lütfen tekrar deneyin.'

interface Props {
  listId: string
  itemId: string
  defaultPurchaserIds: string[]
  options: ItemOptionDto[]
  defaultPurchasedOptionId?: string
  onClose: () => void
  onSuccess: () => void
}

const PurchaserSelectModal = ({
  listId,
  itemId,
  defaultPurchaserIds,
  options,
  defaultPurchasedOptionId,
  onClose,
  onSuccess,
}: Props) => {
  const { data: members, isLoading: isMembersLoading, isError: isMembersError } = useMembers(listId)
  const { mutate: markPurchased, isPending, error } = useMarkPurchased()

  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(createSchema(options.length > 0)),
    defaultValues: { purchaserUserIds: defaultPurchaserIds, purchasedOptionId: defaultPurchasedOptionId },
  })

  const onSubmit = ({ purchaserUserIds, purchasedOptionId }: FormValues) => {
    markPurchased({ itemId, listId, purchaserUserIds, purchasedOptionId }, { onSuccess })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  // 403 carries a user-facing message from useMarkPurchased; anything else gets a generic one
  const selectedOptionId = watch('purchasedOptionId')
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
          <h3 className={styles.title} id="purchaser-title">Satın Alındı Olarak İşaretle</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4 4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {options.length > 0 && (
          <>
            <p className={styles.sectionLabel}>Hangi seçenek alındı?</p>
            <div className={styles.memberList} role="radiogroup">
              {options.map(({ id, title, price }) => (
                <label
                  key={id}
                  className={`${styles.memberRow} ${selectedOptionId === id ? styles.memberRowChecked : ''}`}
                >
                  <input type="radio" className={styles.checkbox} value={id} {...register('purchasedOptionId')} />
                  <span className={styles.memberName}>{title}</span>
                  <span className={styles.optionPrice}>{formatPrice(price)}</span>
                </label>
              ))}
            </div>
            {errors.purchasedOptionId && <p className={styles.errorText}>{errors.purchasedOptionId.message}</p>}
          </>
        )}

        <p className={styles.sectionLabel}>Kim satın aldı? <span className={styles.hintInline}>(birden fazla seçebilirsiniz)</span></p>

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
