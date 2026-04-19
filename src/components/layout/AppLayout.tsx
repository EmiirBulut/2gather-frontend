import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './AppLayout.module.css'

export const AppLayout = () => (
  <div className={styles.wrapper}>
    <Sidebar />
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
)
