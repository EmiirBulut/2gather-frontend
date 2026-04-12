import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateItem } from '../hooks/useCreateItem'
import { useCategories } from '@/features/categories/hooks/useCategories'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './AddItemModal.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const addItemSchema = z.object({
  name: z
    .string()
    .min(2, 'Ürün adı en az 2 karakter olmalı')
    .max(100, 'Ürün adı en fazla 100 karakter olabilir'),
  categoryId: z.string().min(1, 'Kategori seçiniz'),
})

type AddItemFormData = z.infer<typeof addItemSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  listId: string
  onClose: () => void
}

const AddItemModal = ({ listId, onClose }: Props) => {
  const { mutate, isPending, isSuccess, error } = useCreateItem(listId)
  const { data: categories, isLoading: isCategoriesLoading } = useCategories(listId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
  })

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  useEffect(() => {
    if (isSuccess) onClose()
  }, [isSuccess, onClose])

  const handleAdd = (data: AddItemFormData) => {
    mutate({ listId, ...data })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-item-title">
        <div className={styles.header}>
          <h2 className={styles.title} id="add-item-title">Yeni Ürün</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleAdd)} noValidate>
          <div className={styles.fields}>
            <Input
              label="Ürün Adı"
              placeholder="Koltuk, Masa, Avize…"
              errorMessage={errors.name?.message}
              {...register('name')}
            />

            <div className={styles.fieldWrapper}>
              <label className={styles.selectLabel}>Kategori</label>
              <select
                className={`${styles.select} ${errors.categoryId ? styles.selectError : ''}`}
                disabled={isCategoriesLoading}
                {...register('categoryId')}
              >
                <option value="">Kategori seçin…</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className={styles.errorMsg}>{errors.categoryId.message}</span>
              )}
            </div>
          </div>

          {error && (
            <p className={styles.serverError}>{error.message}</p>
          )}

          <div className={styles.actions}>
            <Button variant="ghost" onClick={onClose} type="button">
              İptal
            </Button>
            <Button type="submit" isLoading={isPending}>
              Ekle
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddItemModal
