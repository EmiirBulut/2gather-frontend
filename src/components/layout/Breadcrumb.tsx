import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export const Breadcrumb = ({ items }: Props) => (
  <nav className={styles.breadcrumb}>
    {items.map((item, index) => {
      const isLast = index === items.length - 1
      return (
        <span key={index} className={styles.breadcrumb}>
          {index > 0 && <span className={styles.separator}>›</span>}
          {isLast || !item.href ? (
            <span className={isLast ? styles.current : styles.link}>{item.label}</span>
          ) : (
            <Link to={item.href} className={styles.link}>
              {item.label}
            </Link>
          )}
        </span>
      )
    })}
  </nav>
)
