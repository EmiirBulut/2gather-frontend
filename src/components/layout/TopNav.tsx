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
        <div className={styles.avatar}>{initials}</div>
      </div>
    </header>
  )
}
