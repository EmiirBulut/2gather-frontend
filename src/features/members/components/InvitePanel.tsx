import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInviteMember } from '../hooks/useInvites'
import styles from './InvitePanel.module.css'

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  role: z.enum(['Editor', 'Viewer']),
})

type FormValues = z.infer<typeof schema>

interface Props {
  listId: string
}

const InvitePanel = ({ listId }: Props) => {
  const { mutate: invite, isPending, isError } = useInviteMember(listId)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Editor' },
  })

  const selectedRole = watch('role')

  const handleInvite = (values: FormValues) => {
    invite(values, { onSuccess: () => reset() })
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Yeni Davet Et</h3>
      <p className={styles.description}>
        Projeye yeni bir çalışma arkadaşı veya izleyici ekleyin.
      </p>

      <hr className={styles.divider} />

      <form onSubmit={handleSubmit(handleInvite)}>
        <div className={styles.field}>
          <label className={styles.label}>E-POSTA ADRESİ</label>
          <input
            {...register('email')}
            type="email"
            placeholder="ornek@eposta.com"
            className={styles.input}
          />
          {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>ROL SEÇİN</label>
          <div className={styles.roleToggle}>
            {(['Editor', 'Viewer'] as const).map((role) => (
              <button
                key={role}
                type="button"
                className={`${styles.roleBtn} ${selectedRole === role ? styles.roleBtnActive : ''}`}
                onClick={() => setValue('role', role)}
              >
                {role === 'Editor' ? 'EDİTÖR' : 'İZLEYİCİ'}
              </button>
            ))}
          </div>
          <p className={styles.roleDesc}>
            <strong>Editörler</strong> içerik ekleyebilir ve silebilir.{' '}
            <strong>İzleyiciler</strong> sadece listeyi görüntüleyebilir.
          </p>
        </div>

        {isError && (
          <p className={styles.serverError}>Davet gönderilemedi. Lütfen tekrar deneyin.</p>
        )}

        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending ? 'Gönderiliyor…' : 'Davet Et →'}
        </button>
      </form>

      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className={styles.infoCardTitle}>Ekip Yönetimi</span>
        </div>
        <p className={styles.infoCardText}>
          Davetler 7 gün geçerlidir. Davetli uygulamaya kayıt olarak daveti kabul edebilir.
        </p>
      </div>
    </div>
  )
}

export default InvitePanel
