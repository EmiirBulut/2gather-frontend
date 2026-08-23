import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateList } from '../hooks/useCreateList'
import { ListTemplate } from '../types'
import TemplatePicker from './TemplatePicker'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './CreateListModal.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const createListSchema = z.object({
  name: z
    .string()
    .min(2, 'Liste adı en az 2 karakter olmalı')
    .max(80, 'Liste adı en fazla 80 karakter olabilir'),
})

type CreateListFormData = z.infer<typeof createListSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void
}

const CreateListModal = ({ onClose }: Props) => {
  const { mutate, isPending, isSuccess, error } = useCreateList()
  const [step, setStep] = useState<'template' | 'details'>('template')
  const [template, setTemplate] = useState<ListTemplate | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
  })

  useEffect(() => {
    if (step === 'details') setFocus('name')
  }, [step, setFocus])

  useEffect(() => {
    if (isSuccess) onClose()
  }, [isSuccess, onClose])

  const handleCreate = (data: CreateListFormData) => {
    if (template === null) return
    mutate({ name: data.name, template })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.header}>
          <h2 className={styles.title} id="modal-title">
            {step === 'template' ? 'Şablon Seç' : 'Yeni Liste'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {step === 'template' ? (
          <>
            <TemplatePicker selected={template} onSelect={setTemplate} />

            <div className={styles.actions}>
              <Button variant="ghost" onClick={onClose} type="button">
                İptal
              </Button>
              <Button type="button" disabled={template === null} onClick={() => setStep('details')}>
                İleri
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(handleCreate)} noValidate>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <Input
                label="Liste Adı"
                placeholder="Düğün Alışverişi, Ev Eşyaları…"
                errorMessage={errors.name?.message}
                {...register('name')}
              />
            </div>

            {error && (
              <p style={{
                fontSize: 'var(--text-body-sm)',
                color: 'var(--color-danger)',
                marginBottom: 'var(--space-4)',
              }}>
                {error.message}
              </p>
            )}

            <div className={styles.actions}>
              <Button variant="ghost" onClick={() => setStep('template')} type="button">
                Geri
              </Button>
              <Button type="submit" isLoading={isPending}>
                Oluştur
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateListModal
