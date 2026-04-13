import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { usePermission } from '@/hooks/usePermission'
import InviteMemberModal from '@/features/members/components/InviteMemberModal'
import { ROUTES } from '@/router/routes'
import type { MemberDto } from '@/features/members/types'
import styles from './MembersPage.module.css'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const ROLE_LABELS: Record<MemberDto['role'], string> = {
  Owner: 'Sahip',
  Editor: 'Düzenleyici',
  Viewer: 'İzleyici',
}

// ─── Component ────────────────────────────────────────────────────────────────

const MembersPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const { data: listDetail, isLoading, isError } = useListDetail(listId ?? '')
  const { canManageMembers } = usePermission(listId ?? '')

  const handleBack = () => {
    navigate(ROUTES.LIST_DETAIL_WITH_ID(listId ?? ''))
  }

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <button className={styles.backBtn} onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12 6 8l4-4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Listeye Dön
        </button>
        <div className={styles.navLogoMark}>2G</div>
      </nav>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>İşbirliği</p>
          <h1 className={styles.heroTitle}>Collaborate</h1>
          <p className={styles.heroSub}>
            Ortağını, aile üyelerini veya arkadaşlarını davet et.
          </p>
        </div>
      </div>

      <main className={styles.main}>
        {/* Invite section */}
        {canManageMembers && (
          <div className={styles.inviteSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Yeni Davet</span>
            </div>
            <button
              className={styles.inviteBtn}
              onClick={() => setIsInviteOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" />
              </svg>
              Kişi Davet Et
            </button>
          </div>
        )}

        {/* Members list */}
        <div className={styles.membersSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Mevcut Ekip</span>
            {!isLoading && (
              <span className={styles.memberCount}>
                {listDetail?.members.length ?? 0} üye
              </span>
            )}
          </div>

          {isLoading && (
            <div className={styles.memberList}>
              {[1, 2].map((i) => (
                <div key={i} className={styles.memberSkeleton} />
              ))}
            </div>
          )}

          {isError && (
            <p className={styles.errorText}>Üyeler yüklenemedi.</p>
          )}

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
            </div>
          )}
        </div>
      </main>

      {isInviteOpen && listId && (
        <InviteMemberModal
          listId={listId}
          onClose={() => setIsInviteOpen(false)}
        />
      )}
    </div>
  )
}

export default MembersPage
