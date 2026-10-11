import { useParams } from 'react-router-dom'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import ProfileForm from '@/features/settings/components/ProfileForm'
import PasswordForm from '@/features/settings/components/PasswordForm'
import ListSettingsSection from '@/features/settings/components/ListSettingsSection'
import AppPreferencesSection from '@/features/settings/components/AppPreferencesSection'
import { useCurrentUser } from '@/features/settings/hooks/useCurrentUser'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { ROUTES } from '@/router/routes'
import styles from './SettingsPage.module.css'

// Rendered at /settings (account + app) and /lists/:listId/settings (adds list settings)
const SettingsPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useCurrentUser()
  const { data: listDetail } = useListDetail(listId ?? '')

  return (
    <div className={styles.page}>
      {listId && (
        <Breadcrumb items={[
          { label: listDetail?.name ?? '—', href: ROUTES.LIST_DETAIL_WITH_ID(listId) },
          { label: 'Ayarlar' },
        ]} />
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Ayarlar</h1>
      </div>

      <div className={styles.sections}>
        {listId && listDetail && <ListSettingsSection listId={listId} listName={listDetail.name} />}

        {isProfileLoading && <p className={styles.stateText}>Profil yükleniyor…</p>}
        {isProfileError && <p className={styles.errorText}>Profil bilgileri yüklenemedi.</p>}
        {profile && (
          <>
            <ProfileForm profile={profile} />
            <PasswordForm />
          </>
        )}

        <AppPreferencesSection />
      </div>
    </div>
  )
}

export default SettingsPage
