import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInviteMember } from '../hooks/useInviteMember'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './InviteMemberModal.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const inviteSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  role: z.enum(['Editor', 'Viewer']),
})

type InviteFormData = z.infer<typeof inviteSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  listId: string
  onClose: () => void
}

const InviteMemberModal = ({ listId, onClose }: Props) => {
  const { mutate, isPending, isSuccess, error } = useInviteMember()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'Editor' },
  })

  const handleInvite = (data: InviteFormData) => {
    mutate(
      { listId, data },
      { onSuccess: () => setTimeout(onClose, 1200) }
    )
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="invite-title">
        <div className={styles.header}>
          <h2 className={styles.title} id="invite-title">Kişi Davet Et</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {isSuccess ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M5 14l6 6L23 8" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className={styles.successText}>Davet gönderildi!</p>
            <p className={styles.successSub}>Kişi e-postasındaki bağlantı ile katılabilir.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleInvite)} noValidate>
            <div className={styles.fields}>
              <Input
                label="E-posta Adresi"
                type="email"
                placeholder="partner@example.com"
                errorMessage={errors.email?.message}
                {...register('email')}
              />

              <div className={styles.fieldWrapper}>
                <label className={styles.roleLabel}>İzin Seviyesi</label>
                <div className={styles.roleCards}>
                  <label className={styles.roleCard}>
                    <input
                      type="radio"
                      value="Editor"
                      className={styles.roleRadio}
                      {...register('role')}
                    />
                    <div className={styles.roleCardInner}>
                      <span className={styles.roleCardTitle}>Düzenleyici</span>
                      <span className={styles.roleCardDesc}>Ürün ekleyebilir, düzenleyebilir</span>
                    </div>
                  </label>
                  <label className={styles.roleCard}>
                    <input
                      type="radio"
                      value="Viewer"
                      className={styles.roleRadio}
                      {...register('role')}
                    />
                    <div className={styles.roleCardInner}>
                      <span className={styles.roleCardTitle}>İzleyici</span>
                      <span className={styles.roleCardDesc}>Yalnızca görüntüleyebilir</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <p className={styles.serverError}>{error.message}</p>
            )}

            <div className={styles.actions}>
              <Button variant="ghost" type="button" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" isLoading={isPending}>
                Davet Gönder
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default InviteMemberModal
