import { ListTemplate } from '../types'
import styles from './TemplatePicker.module.css'

// ─── Template Options ─────────────────────────────────────────────────────────

interface TemplateOption {
  id: ListTemplate
  label: string
  description: string
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: ListTemplate.HomeDesign,
    label: 'Ev Tasarımı',
    description: 'Salon, mutfak, yatak odası gibi hazır oda kategorileriyle başlayın.',
  },
  {
    id: ListTemplate.Wedding,
    label: 'Düğün',
    description: 'Mekan, kıyafet, catering gibi hazır düğün kategorileriyle başlayın.',
  },
  {
    id: ListTemplate.Custom,
    label: 'Özel',
    description: 'Boş başlayın, kategorileri kendiniz oluşturun.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  selected: ListTemplate | null
  onSelect: (template: ListTemplate) => void
}

const TemplatePicker = ({ selected, onSelect }: Props) => {
  return (
    <div className={styles.grid} role="radiogroup" aria-label="Şablon seçimi">
      {TEMPLATE_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={selected === option.id}
          className={`${styles.card} ${selected === option.id ? styles.selected : ''}`}
          onClick={() => onSelect(option.id)}
        >
          <span className={styles.cardLabel}>{option.label}</span>
          <span className={styles.cardDescription}>{option.description}</span>
        </button>
      ))}
    </div>
  )
}

export default TemplatePicker
