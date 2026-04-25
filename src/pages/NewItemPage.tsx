import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PriceInput from '@/components/ui/PriceInput'
import { useCreateItem } from '@/features/items/hooks/useCreateItem'
import { useCreateOption } from '@/features/options/hooks/useCreateOption'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { useListDetail } from '@/features/lists/hooks/useListDetail'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ROUTES } from '@/router/routes'
import styles from './NewItemPage.module.css'

const schema = z.object({
  name: z.string().min(1, 'İtem adı zorunludur'),
  categoryId: z.string().min(1, 'Kategori seçimi zorunludur'),
  store: z.string().optional(),
  link: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  price: z.number().positive('Fiyat pozitif olmalıdır').optional(),
  currency: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const CameraIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M28 24a2 2 0 01-2 2H6a2 2 0 01-2-2V12a2 2 0 012-2h4l2-3h8l2 3h4a2 2 0 012 2v12z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="16" cy="17" r="4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const NewItemPage = () => {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: listDetail } = useListDetail(listId ?? '')
  const { data: categories } = useCategories(listId ?? '')
  const { mutate: createItem, isPending: isCreatingItem, error: itemError } = useCreateItem(listId ?? '')
  const [createdItemId, setCreatedItemId] = useState<string | null>(null)
  const { mutate: createOption, isPending: isCreatingOption } = useCreateOption(createdItemId ?? '')

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'TRY' },
  })

  const selectedCategoryId = watch('categoryId')

  if (!listId) {
    navigate(ROUTES.LISTS)
    return null
  }

  const listName = listDetail?.name ?? '—'

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const isPending = isCreatingItem || isCreatingOption

  const onSubmit = (data: FormValues) => {
    createItem(
      { listId, categoryId: data.categoryId, name: data.name },
      {
        onSuccess: (item) => {
          const hasOption = data.store || (data.link && data.link !== '') || !!data.price
          if (hasOption) {
            setCreatedItemId(item.id)
            createOption(
              {
                itemId: item.id,
                title: data.store || item.name,
                price: data.price,
                currency: data.currency || 'TRY',
                link: data.link || undefined,
              },
              { onSuccess: () => navigate(ROUTES.ITEM_LIST_WITH_ID(listId)) }
            )
          } else {
            navigate(ROUTES.ITEM_LIST_WITH_ID(listId))
          }
        },
      }
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb items={[
        { label: listName, href: ROUTES.LIST_DETAIL_WITH_ID(listId) },
        { label: 'İtem Listesi', href: ROUTES.ITEM_LIST_WITH_ID(listId) },
        { label: 'Yeni İtem' },
      ]} />

      <div className={styles.header}>
        <h1 className={styles.title}>Yeni İtem Ekle</h1>
        <p className={styles.subtitle}>Listeye yeni bir ürün veya eşya ekleyin</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.layout}>
          {/* ── Sol sütun — form ── */}
          <div className={styles.formCol}>
            {/* İtem adı */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>İtem Adı</label>
              <input
                {...register('name')}
                className={styles.nameInput}
                placeholder="Ör: Koltuk takımı, TV ünitesi…"
              />
              {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
            </div>

            {/* Kategori seçimi */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Kategori</label>
              <div className={styles.chipGroup}>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${styles.chip} ${selectedCategoryId === cat.id ? styles.chipActive : ''}`}
                    onClick={() => setValue('categoryId', cat.id, { shouldValidate: true })}
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  type="button"
                  className={`${styles.chip} ${styles.chipAdd}`}
                  onClick={() => navigate(ROUTES.ITEM_LIST_WITH_ID(listId))}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Yeni
                </button>
              </div>
              {errors.categoryId && <p className={styles.errorText}>{errors.categoryId.message}</p>}
            </div>

            {/* Satın alma seçeneği */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Satın Alma Seçeneği <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opsiyonel)</span></label>
              <div className={styles.optionCard}>
                <div className={styles.optionCardTitle}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1h1.5l2 8.5a1.5 1.5 0 001.46 1.2h6.58a1.5 1.5 0 001.45-1.16L15 5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="7" cy="15" r="1.2" fill="currentColor"/>
                    <circle cx="13" cy="15" r="1.2" fill="currentColor"/>
                  </svg>
                  Mağaza / Ürün Bilgisi
                </div>
                <div className={styles.optionFields}>
                  <div>
                    <label className={styles.optionFieldLabel}>Mağaza Adı</label>
                    <input
                      {...register('store')}
                      className={styles.optionInput}
                      placeholder="IKEA, Karaca…"
                    />
                  </div>
                  <div>
                    <label className={styles.optionFieldLabel}>Ürün Linki</label>
                    <input
                      {...register('link')}
                      className={styles.optionInput}
                      placeholder="https://…"
                    />
                    {errors.link && <p className={styles.errorText}>{errors.link.message}</p>}
                  </div>
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
                </div>
              </div>
            </div>

            {/* Sunucu hatası */}
            {itemError && (
              <p className={styles.serverError}>{itemError.message}</p>
            )}

            {/* Action bar */}
            <div className={styles.actionBar}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate(ROUTES.ITEM_LIST_WITH_ID(listId))}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                İptal
              </button>
              <button type="submit" className={styles.saveBtn} disabled={isPending}>
                {isPending ? 'Kaydediliyor…' : (
                  <>
                    Kaydet
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Sağ sütun — görsel upload ── */}
          <div className={styles.uploadCol}>
            <label className={styles.fieldLabel}>Ürün Görseli</label>
            <div
              className={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Önizleme" className={styles.uploadPreview} />
              ) : (
                <>
                  <span className={styles.uploadIcon}><CameraIcon /></span>
                  <p className={styles.uploadLabel}>Görsel yüklemek için tıklayın veya sürükleyin</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </form>

      <div className={styles.watermark}>
        <span>{listName.toUpperCase()}</span><br />
        <span>FORM / YENI-ITEM</span>
      </div>
    </div>
  )
}

export default NewItemPage
