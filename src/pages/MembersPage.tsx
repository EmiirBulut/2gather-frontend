import { useParams, useNavigate } from 'react-router-dom'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { usePermission } from '@/hooks/usePermission'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import InvitePanel from '@/features/members/components/InvitePanel'
import PendingInviteList from '@/features/members/components/PendingInviteList'
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

const MembersPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()

  const { data: listDetail, isLoading, isError } = useListDetail(listId ?? '')
  const { canManageMembers, isOwner } = usePermission(listId ?? '')

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  const listName = listDetail?.name ?? '—'

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
        {/* ── Sol sütun ── */}
        <div className={styles.leftCol}>
          {/* Aktif Üyeler */}
          <div>
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

          {/* Bekleyen Davetler — sadece Owner görür */}
          {isOwner && <PendingInviteList listId={listId} />}
        </div>

        {/* ── Sağ panel — sadece Owner ── */}
        {canManageMembers && (
          <div className={styles.rightCol}>
            <InvitePanel listId={listId} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MembersPage
