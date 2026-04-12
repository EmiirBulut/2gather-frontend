import { forwardRef } from 'react'
import styles from './Input.module.css'

interface Props {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url'
  errorMessage?: string
  disabled?: boolean
  autoComplete?: string
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, placeholder, type = 'text', errorMessage, disabled, autoComplete, ...rest }, ref) => {
    const hasError = Boolean(errorMessage)

    return (
      <div className={`${styles.wrapper} ${hasError ? styles.hasError : ''}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={styles.input}
            {...rest}
          />
        </div>
        {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
