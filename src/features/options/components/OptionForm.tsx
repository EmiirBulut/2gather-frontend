import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { ItemOptionDto } from '../types'
import styles from './OptionForm.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const optionSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı').max(120),
  price: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== '' ? parseFloat(v) : undefined))
    .pipe(z.number().positive('Fiyat pozitif olmalı').optional()),
  currency: z.string().max(10).optional(),
  link: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
})

type OptionFormData = z.infer<typeof optionSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  itemId: string
  existing?: ItemOptionDto
  isPending: boolean
  error: string | null
  onSubmit: (data: {
    title: string
    price?: number
    currency?: string
    link?: string
    notes?: string
  }) => void
  onCancel: () => void
}

const OptionForm = ({ existing, isPending, error, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<OptionFormData>({
    resolver: zodResolver(optionSchema),
    defaultValues: {
      title: existing?.title ?? '',
      price: existing?.price != null ? String(existing.price) as unknown as number : undefined,
      currency: existing?.currency ?? 'USD',
      link: existing?.link ?? '',
      notes: existing?.notes ?? '',
    },
  })

  useEffect(() => {
    setFocus('title')
  }, [setFocus])

  const handleFormSubmit = (data: OptionFormData) => {
    onSubmit({
      title: data.title,
      price: data.price,
      currency: data.currency || undefined,
      link: data.link || undefined,
      notes: data.notes || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form} noValidate>
      <Input
        label="Kaynak / Başlık"
        placeholder="Within Design Reach, IKEA…"
        errorMessage={errors.title?.message}
        {...register('title')}
      />

      <div className={styles.row}>
        <Input
          label="Fiyat"
          type="number"
          placeholder="0.00"
          errorMessage={errors.price?.message}
          {...register('price')}
        />
        <Input
          label="Para Birimi"
          placeholder="USD"
          errorMessage={errors.currency?.message}
          {...register('currency')}
        />
      </div>

      <Input
        label="Bağlantı (URL)"
        type="url"
        placeholder="https://…"
        errorMessage={errors.link?.message}
        {...register('link')}
      />

      <div>
        <label className={styles.fieldLabel}>Notlar</label>
        <textarea
          className={styles.textarea}
          placeholder="Renk, model, teslimat süresi…"
          {...register('notes')}
        />
        {errors.notes && (
          <span className={styles.errorText}>{errors.notes.message}</span>
        )}
      </div>

      {error && (
        <p className={styles.errorText}>{error}</p>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" type="button" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" isLoading={isPending}>
          {existing ? 'Güncelle' : 'Ekle'}
        </Button>
      </div>
    </form>
  )
}

export default OptionForm
