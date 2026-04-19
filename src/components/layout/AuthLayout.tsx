import { Outlet } from 'react-router-dom'
import styles from './AuthLayout.module.css'

export const AuthLayout = () => (
  <div className={styles.wrapper}>
    <Outlet />
  </div>
)
