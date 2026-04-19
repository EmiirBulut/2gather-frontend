import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/router/routes'
import { useAuthStore } from '@/store/authStore'
import styles from './TopNav.module.css'

export const TopNav = () => {
  const user = useAuthStore((s) => s.user)

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <header className={styles.nav}>
      <NavLink to={ROUTES.LISTS} className={styles.logo}>
        2gather
      </NavLink>

      <nav className={styles.links}>
        <NavLink
          to={ROUTES.LISTS}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.linkActive : ''}`
          }
        >
          Dashboard
        </NavLink>
      </nav>

      <div className={styles.right}>
        <button className={styles.bellBtn} aria-label="Bildirimler">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8.5 16.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={styles.avatar}>{initials}</div>
      </div>
    </header>
  )
}
