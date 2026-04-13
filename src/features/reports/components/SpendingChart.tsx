import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { CategoryReport } from '../types'
import styles from './SpendingChart.module.css'

interface Props {
  data: CategoryReport[]
}

interface TooltipPayload {
  value: number
  name: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        {payload[0].value} ürün
      </p>
    </div>
  )
}

const SpendingChart = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <div className={styles.empty}>Henüz kategori verisi yok.</div>
    )
  }

  const chartData = data.map((d) => ({
    name: d.categoryName,
    purchased: d.purchasedCount,
    pending: d.pendingCount,
  }))

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          barSize={10}
          barGap={3}
        >
          <XAxis
            type="number"
            tick={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: 'var(--color-on-surface-variant)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fontFamily: 'var(--font-body)', fontSize: 12, fill: 'var(--color-on-surface)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71,89,73,0.05)' }} />
          <Bar dataKey="purchased" name="Alınan" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill="var(--color-purchased)" fillOpacity={0.85} />
            ))}
          </Bar>
          <Bar dataKey="pending" name="Bekleyen" radius={[0, 4, 4, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill="var(--color-pending)" fillOpacity={0.65} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotPurchased}`} />
          <span className={styles.legendLabel}>Alınan</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.dotPending}`} />
          <span className={styles.legendLabel}>Bekleyen</span>
        </div>
      </div>
    </div>
  )
}

export default SpendingChart
