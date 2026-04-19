import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import styles from './TopNavLayout.module.css'

export const TopNavLayout = () => (
  <div className={styles.wrapper}>
    <TopNav />
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
)
