import styles from './SegmentedProgressBar.module.css'

interface Props {
  total: number
  completed: number
}

const SegmentedProgressBar = ({ total, completed }: Props) => {
  if (total === 0) return null

  return (
    <div className={styles.bar}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`${styles.segment} ${i < completed ? styles.segmentFilled : styles.segmentEmpty}`}
        />
      ))}
    </div>
  )
}

export default SegmentedProgressBar
