import { useState } from 'react'
import styles from './StarRating.module.css'

interface Props {
  value: number | null
  onChange?: (score: number) => void
  size?: 'sm' | 'md'
}

const StarRating = ({ value, onChange, size = 'md' }: Props) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const isReadOnly = onChange === undefined

  const display = hovered ?? value ?? 0

  return (
    <div
      className={`${styles.stars} ${styles[size]} ${isReadOnly ? styles.readOnly : ''}`}
      onMouseLeave={() => setHovered(null)}
      role={isReadOnly ? undefined : 'group'}
      aria-label={isReadOnly ? `${value ?? 0} / 5 yıldız` : 'Puan ver'}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${display >= star ? styles.filled : styles.empty}`}
          onClick={() => !isReadOnly && onChange?.(star)}
          onMouseEnter={() => !isReadOnly && setHovered(star)}
          disabled={isReadOnly}
          aria-label={`${star} yıldız`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating
