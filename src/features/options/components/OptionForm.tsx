import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PriceInput from '@/components/ui/PriceInput'
import type { ItemOptionDto } from '../types'
import styles from './OptionForm.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const optionSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı').max(120),
  price: z.number().positive('Fiyat pozitif olmalı').optional(),
  link: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  color: z.string().max(50).optional(),
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
    link?: string
    notes?: string
    brand?: string
    model?: string
    color?: string
  }) => void
  onCancel: () => void
}

const OptionForm = ({ existing, isPending, error, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
  } = useForm<OptionFormData>({
    resolver: zodResolver(optionSchema),
    defaultValues: {
      title: existing?.title ?? '',
      price: existing?.price ?? undefined,
      link: existing?.link ?? '',
      notes: existing?.notes ?? '',
      brand: existing?.brand ?? '',
      model: existing?.model ?? '',
      color: existing?.color ?? '',
    },
  })

  useEffect(() => {
    setFocus('title')
  }, [setFocus])

  const handleFormSubmit = (data: OptionFormData) => {
    onSubmit({
      title: data.title,
      price: data.price,
      link: data.link || undefined,
      notes: data.notes || undefined,
      brand: data.brand || undefined,
      model: data.model || undefined,
      color: data.color || undefined,
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

      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <PriceInput
            label="Fiyat"
            placeholder="0"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.price?.message}
            suffix="₺"
          />
        )}
      />

      <Input
        label="Bağlantı (URL)"
        type="url"
        placeholder="https://…"
        errorMessage={errors.link?.message}
        {...register('link')}
      />

      <div className={styles.row}>
        <Input
          label="Marka"
          placeholder="Samsung, Bosch…"
          errorMessage={errors.brand?.message}
          {...register('brand')}
        />
        <Input
          label="Model"
          placeholder="Galaxy S24, Serie 8…"
          errorMessage={errors.model?.message}
          {...register('model')}
        />
      </div>

      <Input
        label="Renk"
        placeholder="Beyaz, Siyah…"
        errorMessage={errors.color?.message}
        {...register('color')}
      />

      <div>
        <label className={styles.fieldLabel}>Notlar</label>
        <textarea
          className={styles.textarea}
          placeholder="Ek bilgiler, teslimat süresi…"
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
