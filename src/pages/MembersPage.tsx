import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { useInviteMember } from '@/features/members/hooks/useInviteMember'
import { usePermission } from '@/hooks/usePermission'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES } from '@/router/routes'
import type { MemberDto } from '@/features/members/types'
import styles from './MembersPage.module.css'

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const ROLE_LABELS: Record<MemberDto['role'], string> = {
  Owner: 'SAHİP',
  Editor: 'EDİTÖR',
  Viewer: 'İZLEYİCİ',
}

const inviteSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  role: z.enum(['Editor', 'Viewer']),
})

type InviteFormValues = z.infer<typeof inviteSchema>

const MembersPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const { data: listDetail, isLoading, isError } = useListDetail(listId ?? '')
  const { canManageMembers } = usePermission(listId ?? '')
  const { mutate: inviteMember, isPending: isInviting, error: inviteError } = useInviteMember()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'Editor' },
  })

  const selectedRole = watch('role')

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  const listName = listDetail?.name ?? '—'

  const handleInviteSubmit = (data: InviteFormValues) => {
    inviteMember(
      { listId, data },
      {
        onSuccess: () => {
          setInviteSuccess(true)
          reset()
          setTimeout(() => setInviteSuccess(false), 3000)
        },
      }
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb items={[
        { label: listName, href: ROUTES.LIST_DETAIL_WITH_ID(listId) },
        { label: 'Üyeler' },
      ]} />

      {/* ── Header ── */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>{listName.toUpperCase()}</p>
        <h1 className={styles.title}>Üyeler</h1>
        <p className={styles.subtitle}>
          Listenizi birlikte yönetin. Editörler seçenek ekleyebilir, izleyiciler listeyi takip edebilir.
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Sol sütun — üye listesi ── */}
        <div className={styles.leftCol}>
          {/* Aktif Üyeler */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Aktif Üyeler</h2>

            {isLoading && (
              <div className={styles.memberList}>
                {[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} style={{ height: 68 }} />)}
              </div>
            )}
            {isError && <p className={styles.errorText}>Üyeler yüklenemedi.</p>}

            {!isLoading && !isError && (
              <div className={styles.memberList}>
                {listDetail?.members.map((member) => (
                  <div key={member.userId} className={styles.memberRow}>
                    <div className={styles.avatar}>{initials(member.displayName)}</div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{member.displayName}</span>
                      <span className={styles.memberEmail}>{member.email}</span>
                    </div>
                    <span className={`${styles.roleBadge} ${styles[`role${member.role}`]}`}>
                      {ROLE_LABELS[member.role]}
                    </span>
                  </div>
                ))}
                {listDetail?.members.length === 0 && (
                  <p className={styles.emptyText}>Henüz üye yok.</p>
                )}
              </div>
            )}
          </div>

          {/* Bekleyen Davetler */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Bekleyen Davetler</h2>
            <p className={styles.emptyText}>Bekleyen davet bulunmuyor.</p>
          </div>
        </div>

        {/* ── Sağ panel — davet formu ── */}
        {canManageMembers && (
          <div className={styles.rightCol}>
            <div className={styles.inviteCard}>
              <h3 className={styles.inviteTitle}>Yeni Davet Et</h3>
              <p className={styles.inviteSubtitle}>
                Projeye yeni bir çalışma arkadaşı veya izleyici ekleyin.
              </p>

              <form onSubmit={handleSubmit(handleInviteSubmit)}>
                <div className={styles.inviteField}>
                  <label className={styles.inviteFieldLabel}>E-POSTA ADRESİ</label>
                  <input
                    {...register('email')}
                    className={styles.inviteInput}
                    placeholder="ornek@eposta.com"
                    type="email"
                  />
                  {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
                </div>

                <div className={styles.inviteField}>
                  <label className={styles.inviteFieldLabel}>ROL SEÇİN</label>
                  <div className={styles.roleChips}>
                    <button
                      type="button"
                      className={`${styles.roleChip} ${selectedRole === 'Editor' ? styles.roleChipActive : ''}`}
                      onClick={() => setValue('role', 'Editor')}
                    >
                      EDİTÖR
                    </button>
                    <button
                      type="button"
                      className={`${styles.roleChip} ${selectedRole === 'Viewer' ? styles.roleChipActive : ''}`}
                      onClick={() => setValue('role', 'Viewer')}
                    >
                      İZLEYİCİ
                    </button>
                  </div>
                  <p className={styles.roleDesc}>
                    <strong>Editörler</strong> içerik ekleyebilir ve silebilir.{' '}
                    <strong>İzleyiciler</strong> sadece listeyi görüntüleyebilir.
                  </p>
                </div>

                {inviteError && (
                  <p className={styles.fieldError}>{inviteError.message}</p>
                )}
                {inviteSuccess && (
                  <p className={styles.successText}>Davet başarıyla gönderildi!</p>
                )}

                <button type="submit" className={styles.inviteBtn} disabled={isInviting}>
                  {isInviting ? 'Gönderiliyor…' : 'Davet Et →'}
                </button>
              </form>
            </div>

            {/* Ekip Yönetimi info */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span className={styles.infoCardTitle}>Ekip Yönetimi</span>
              </div>
              <p className={styles.infoCardText}>
                Ücretsiz plan kapsamında en fazla 5 aktif üye ekleyebilirsiniz. Üst sınırı artırmak için planınızı yükseltin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MembersPage
