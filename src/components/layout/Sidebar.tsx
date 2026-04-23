import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ROUTES } from '@/router/routes'
import { useAuthStore } from '@/store/authStore'
import { getListDetail } from '@/features/lists/api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import styles from './Sidebar.module.css'

const HomeIcon = () => (
  <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 6.5L8 2l6 4.5V14a.5.5 0 01-.5.5h-4V10h-3v4.5h-4A.5.5 0 012 14V6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
)

const ListIcon = () => (
  <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 4h11M2.5 8h11M2.5 12h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const ChartIcon = () => (
  <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12V8.5M6 12V5M10 12V7.5M14 12V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const UsersIcon = () => (
  <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 14c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M11 7.5c1.5 0 3 .8 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="11" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11.5L4.5 7 9 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SettingsIcon = () => (
  <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const Sidebar = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const { data: listDetail } = useQuery({
    queryKey: QUERY_KEYS.LIST_DETAIL(listId!),
    queryFn: () => getListDetail(listId!),
    enabled: Boolean(listId),
  })

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoName}>2gather</div>
        <div className={styles.logoTagline}>Birlikte Planlayın</div>
      </div>

      <nav className={styles.nav}>
        {listId ? (
          <>
            <button
              className={styles.backLink}
              onClick={() => navigate(ROUTES.LISTS)}
            >
              <BackIcon />
              {listDetail ? (
                <span className={styles.backLinkName}>{listDetail.name}</span>
              ) : (
                <span className={styles.backLinkSkeleton} />
              )}
            </button>

            <div className={styles.planNav}>
              <NavLink
                to={ROUTES.LIST_DETAIL_WITH_ID(listId)}
                end
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <HomeIcon />
                Dashboard
              </NavLink>
              <NavLink
                to={ROUTES.ITEM_LIST_WITH_ID(listId)}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <ListIcon />
                İtem Listesi
              </NavLink>
              <NavLink
                to={ROUTES.REPORTS_WITH_ID(listId)}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <ChartIcon />
                Raporlar
              </NavLink>
              <NavLink
                to={ROUTES.MEMBERS_WITH_ID(listId)}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
              >
                <UsersIcon />
                Üyeler
              </NavLink>
            </div>
          </>
        ) : (
          <NavLink
            to={ROUTES.LISTS}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <HomeIcon />
            Planlarım
          </NavLink>
        )}
      </nav>

      <div className={styles.bottom}>
        <a className={styles.settingsItem}>
          <SettingsIcon />
          Ayarlar
        </a>
        <div className={styles.user}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.displayName ?? '—'}</div>
            <div className={styles.userRole}>Üye</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
