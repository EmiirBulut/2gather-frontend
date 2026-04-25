import { useState, useEffect } from 'react'
import styles from './Input.module.css'

const numberFmt = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 })

function formatDisplay(value: number): string {
  return numberFmt.format(value)
}

function parseInput(raw: string): number | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  // Turkish convention: dot = thousands separator, comma = decimal separator
  const normalized = trimmed.replace(/\./g, '').replace(',', '.')
  const num = parseFloat(normalized)
  return isNaN(num) || num < 0 ? undefined : num
}

interface Props {
  label?: string
  placeholder?: string
  errorMessage?: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  onBlur?: () => void
  suffix?: string
}

const PriceInput = ({ label, placeholder, errorMessage, value, onChange, onBlur, suffix }: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState<string>(
    value != null ? formatDisplay(value) : ''
  )
  const hasError = Boolean(errorMessage)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value != null ? formatDisplay(value) : '')
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setDisplayValue(raw)
    onChange(parseInput(raw))
  }

  const handleFocus = () => setIsFocused(true)

  const handleBlur = () => {
    setIsFocused(false)
    setDisplayValue(value != null ? formatDisplay(value) : '')
    onBlur?.()
  }

  return (
    <div className={`${styles.wrapper} ${hasError ? styles.hasError : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder ?? '0'}
          className={styles.input}
          style={suffix ? { paddingRight: 28 } : undefined}
        />
        {suffix && (
          <span style={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 13,
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
          }}>
            {suffix}
          </span>
        )}
      </div>
      {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  )
}

export default PriceInput
