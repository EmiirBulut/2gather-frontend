import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCategories } from '../hooks/useCategories'
import { useCreateCategory } from '../hooks/useCreateCategory'
import { useUpdateCategory } from '../hooks/useUpdateCategory'
import { usePermission } from '@/hooks/usePermission'
import type { CategoryDto } from '../types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import styles from './AddCategoryModal.module.css'

// ─── Schema ───────────────────────────────────────────────────────────────────

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Kategori adı en az 2 karakter olmalı')
    .max(60, 'Kategori adı en fazla 60 karakter olabilir'),
  roomLabel: z
    .string()
    .min(2, 'Oda etiketi en az 2 karakter olmalı')
    .max(60, 'Oda etiketi en fazla 60 karakter olabilir'),
})

type CategoryFormData = z.infer<typeof categoryFormSchema>

// ─── Category Row (existing category, with inline edit) ───────────────────────

interface CategoryRowProps {
  category: CategoryDto
  canEdit: boolean
  isSaving: boolean
  onSave: (data: CategoryFormData) => void
}

const CategoryRow = ({ category, canEdit, isSaving, onSave }: CategoryRowProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: category.name, roomLabel: category.roomLabel },
  })

  const handleCancel = () => {
    reset({ name: category.name, roomLabel: category.roomLabel })
    setIsEditing(false)
  }

  const submitEdit = handleSubmit((data) => {
    onSave(data)
    setIsEditing(false)
  })

  if (isEditing) {
    return (
      <form onSubmit={submitEdit} className={styles.categoryRowEditing} noValidate>
        <div className={styles.categoryRowFields}>
          <Input placeholder="Kategori adı" errorMessage={errors.name?.message} {...register('name')} />
          <Input placeholder="Oda etiketi" errorMessage={errors.roomLabel?.message} {...register('roomLabel')} />
        </div>
        <div className={styles.categoryRowActions}>
          <Button variant="ghost" size="sm" type="button" onClick={handleCancel}>
            Vazgeç
          </Button>
          <Button size="sm" type="submit" isLoading={isSaving}>
            Kaydet
          </Button>
        </div>
      </form>
    )
  }

  return (
    <div className={styles.categoryRow}>
      <div className={styles.categoryRowInfo}>
        <span className={styles.categoryRowName}>{category.name}</span>
        <span className={styles.categoryRowLabel}>{category.roomLabel}</span>
      </div>
      {canEdit && !category.isSystem && (
        <button
          type="button"
          className={styles.editBtn}
          aria-label={`${category.name} kategorisini düzenle`}
          onClick={() => setIsEditing(true)}
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <path
              d="M10.5 2.5a1.5 1.5 0 0 1 2 2l-7 7-2.5.5.5-2.5 7-7Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  listId: string
  onClose: () => void
}

const AddCategoryModal = ({ listId, onClose }: Props) => {
  const { data: categories } = useCategories(listId)
  const { canEdit } = usePermission(listId)
  const { mutate: createCategory, isPending: isCreating, error: createError } = useCreateCategory(listId)
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory(listId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
  })

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  const handleAdd = (data: CategoryFormData) => {
    createCategory({ listId, data }, { onSuccess: () => reset() })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-cat-title">
        <div className={styles.header}>
          <h2 className={styles.title} id="add-cat-title">Kategoriler</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Kapat">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5 4.5 13.5M4.5 4.5l9 9"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {categories && categories.length > 0 && (
          <>
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  canEdit={canEdit}
                  isSaving={isUpdating}
                  onSave={(data) => updateCategory({ categoryId: category.id, data })}
                />
              ))}
            </div>
            {canEdit && <hr className={styles.sectionDivider} />}
          </>
        )}

        {canEdit && (
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

            {createError && (
              <p className={styles.serverError}>{createError.message}</p>
            )}

            <div className={styles.actions}>
              <Button variant="ghost" type="button" onClick={onClose}>
                Kapat
              </Button>
              <Button type="submit" isLoading={isCreating}>
                Ekle
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddCategoryModal
