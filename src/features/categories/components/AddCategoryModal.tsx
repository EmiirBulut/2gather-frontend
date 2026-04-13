import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateCategory } from '../hooks/useCreateCategory'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './AddCategoryModal.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const addCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Kategori adı en az 2 karakter olmalı')
    .max(60, 'Kategori adı en fazla 60 karakter olabilir'),
  roomLabel: z
    .string()
    .min(2, 'Oda etiketi en az 2 karakter olmalı')
    .max(60, 'Oda etiketi en fazla 60 karakter olabilir'),
})

type AddCategoryFormData = z.infer<typeof addCategorySchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  listId: string
  onClose: () => void
}

const AddCategoryModal = ({ listId, onClose }: Props) => {
  const { mutate, isPending, isSuccess, error } = useCreateCategory(listId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
  })

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  useEffect(() => {
    if (isSuccess) onClose()
  }, [isSuccess, onClose])

  const handleAdd = (data: AddCategoryFormData) => {
    mutate({ listId, data })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-cat-title">
        <div className={styles.header}>
          <h2 className={styles.title} id="add-cat-title">Yeni Kategori</h2>
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
              label="Kategori Adı"
              placeholder="Oturma Odası, Teras…"
              errorMessage={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Oda Etiketi"
              placeholder="Living Room, Terrace…"
              errorMessage={errors.roomLabel?.message}
              {...register('roomLabel')}
            />
          </div>

          {error && (
            <p className={styles.serverError}>{error.message}</p>
          )}

          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={onClose}>
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

export default AddCategoryModal
