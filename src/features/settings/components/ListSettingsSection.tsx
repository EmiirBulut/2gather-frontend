import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AddCategoryModal from '@/features/categories/components/AddCategoryModal'
import { useRenameList } from '@/features/lists/hooks/useRenameList'
import { useDeleteList } from '@/features/lists/hooks/useDeleteList'
import { usePermission } from '@/hooks/usePermission'
import { ROUTES } from '@/router/routes'
import { getSettingsErrorMessage } from './settingsErrors'
import styles from './SettingsSection.module.css'

const schema = z.object({
  name: z.string().trim().min(1, 'Liste adı zorunludur').max(200, 'Liste adı en fazla 200 karakter olabilir'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  listId: string
  listName: string
}

const ListSettingsSection = ({ listId, listName }: Props) => {
  const navigate = useNavigate()
  const { canEdit, isOwner } = usePermission(listId)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const { mutate: renameList, isPending: isRenaming, isSuccess: isRenamed, error: renameError, reset: resetRename } = useRenameList(listId)
  const { mutate: deleteList, isPending: isDeleting, error: deleteError } = useDeleteList()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: { name: listName },
  })

  const renameErrorMessage = getSettingsErrorMessage(renameError)
  const deleteErrorMessage = getSettingsErrorMessage(deleteError)

  const onRename = ({ name }: FormValues) => {
    resetRename()
    renameList({ name })
  }

  const handleDelete = () => {
    if (!confirm(`"${listName}" listesini ve içindeki tüm ürünleri kalıcı olarak silmek istiyor musunuz?`)) return
    deleteList(listId, { onSuccess: () => navigate(ROUTES.LISTS) })
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Liste Ayarları</h2>

      {isOwner ? (
        <form className={styles.form} onSubmit={handleSubmit(onRename)} noValidate>
          <Input label="Liste Adı" errorMessage={errors.name?.message} {...register('name')} />
          <div className={styles.actions}>
            <Button type="submit" isLoading={isRenaming}>Kaydet</Button>
            {isRenamed && <span className={styles.successText}>Liste adı güncellendi.</span>}
            {renameErrorMessage && <span className={styles.errorText}>{renameErrorMessage}</span>}
          </div>
        </form>
      ) : (
        <p className={styles.mutedText}>Liste adını ve silme işlemini yalnızca liste sahibi değiştirebilir.</p>
      )}

      {canEdit && (
        <>
          <hr className={styles.divider} />
          <div className={styles.row}>
            <div className={styles.rowLabel}>
              <span className={styles.rowTitle}>Kategoriler</span>
              <span className={styles.rowHint}>Özel kategori ekleyin veya mevcut kategorileri düzenleyin.</span>
            </div>
            <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>Kategorileri Yönet</Button>
          </div>
        </>
      )}

      {isOwner && (
        <>
          <hr className={styles.divider} />
          <div className={styles.dangerZone}>
            <div className={styles.rowLabel}>
              <span className={styles.dangerTitle}>Listeyi Sil</span>
              <span className={styles.rowHint}>Liste, ürünler, seçenekler ve davetler kalıcı olarak silinir.</span>
            </div>
            <button type="button" className={styles.dangerButton} onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Siliniyor…' : 'Listeyi Sil'}
            </button>
          </div>
          {deleteErrorMessage && <p className={styles.errorText}>{deleteErrorMessage}</p>}
        </>
      )}

      {isCategoryModalOpen && (
        <AddCategoryModal listId={listId} onClose={() => setIsCategoryModalOpen(false)} />
      )}
    </section>
  )
}

export default ListSettingsSection
