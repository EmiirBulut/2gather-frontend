import { useCategories } from '../hooks/useCategories'
import type { CategoryDto } from '../types'
import styles from './CategoryFilter.module.css'

interface Props {
  listId: string
  selectedCategoryId: string | null
  onChange: (categoryId: string | null) => void
}

const CategoryFilter = ({ listId, selectedCategoryId, onChange }: Props) => {
  const { data: categories, isLoading } = useCategories(listId)

  if (isLoading || !categories || categories.length === 0) return null

  return (
    <div className={styles.filterBar} role="group" aria-label="Kategori filtresi">
      <button
        className={`${styles.chip} ${selectedCategoryId === null ? styles.active : ''}`}
        onClick={() => onChange(null)}
      >
        Tümü
      </button>
      {categories.map((cat: CategoryDto) => (
        <button
          key={cat.id}
          className={`${styles.chip} ${selectedCategoryId === cat.id ? styles.active : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
