// ─── Formatters ───────────────────────────────────────────────────────────────

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return '—'
  return priceFormatter.format(value)
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Bugün'
  if (days === 1) return '1 gün önce'
  return `${days} gün önce`
}
