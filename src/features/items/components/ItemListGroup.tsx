import ItemCard from './ItemCard'
import type { ItemDto } from '../types'
import styles from './ItemListGroup.module.css'

interface Props {
  categoryName: string
  items: ItemDto[]
  onItemClick: (item: ItemDto) => void
}

const ItemListGroup = ({ categoryName, items, onItemClick }: Props) => {
  return (
    <div className={styles.group}>
      <div className={styles.groupHeader}>
        <h3 className={styles.groupTitle}>{categoryName}</h3>
        <span className={styles.groupCount}>{items.length}</span>
      </div>
      <div className={styles.items}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  )
}

export default ItemListGroup
