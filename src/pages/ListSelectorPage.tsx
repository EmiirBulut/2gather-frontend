import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLists } from '@/features/lists/hooks/useLists'
import ListCard from '@/features/lists/components/ListCard'
import CreateListModal from '@/features/lists/components/CreateListModal'
import { useAuthStore } from '@/store/authStore'
import { deleteList } from '@/features/lists/api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import styles from './ListSelectorPage.module.css'

const ListSelectorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: lists, isLoading, isError } = useLists()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LISTS })
    },
  })

  const ownedLists = lists?.filter((l) => l.currentUserRole === 0) ?? []
  const invitedLists = lists?.filter((l) => l.currentUserRole !== 0) ?? []
  const firstName = user?.displayName?.split(' ')[0] ?? 'Hoş geldin'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.headerGreeting}>Hoş geldin, {firstName}.</h1>
        <p className={styles.headerSub}>Birlikte planlamaya kaldığın yerden devam et.</p>
      </div>

      <div className={styles.columns}>
        {/* ── Sol: Planlarım ── */}
        <div className={styles.left}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Planlarım</span>
            {!isLoading && !isError && (
              <span className={styles.sectionCount}>{ownedLists.length} AKTİF PROJE</span>
            )}
          </div>

          <div className={styles.listStack}>
            {isLoading && [1, 2].map((i) => <div key={i} className={styles.skeleton} />)}

            {isError && (
              <div className={styles.emptyState}>Listeler yüklenemedi. Sayfayı yenileyin.</div>
            )}

            {!isLoading && !isError && ownedLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                isOwner={true}
                onDelete={handleDelete}
              />
            ))}

            <div className={styles.newCard} onClick={() => setIsModalOpen(true)} role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}>
              <div className={styles.newCardIcon}>+</div>
              <span className={styles.newCardLabel}>Yeni Plan Oluştur</span>
            </div>
          </div>
        </div>

        {/* ── Sağ: Davet edildiğim planlar ── */}
        <div className={styles.right}>
          <div className={styles.invitedSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Davet Edildiğim Planlar</span>
            </div>
            <p className={styles.invitedDesc}>
              Seni davet eden planlar burada görünür.
            </p>

            <div className={styles.listStack}>
              {!isLoading && invitedLists.map((list) => (
                <ListCard
                  key={list.id}
                  list={list}
                  isOwner={false}
                  onDelete={handleDelete}
                />
              ))}

              {!isLoading && invitedLists.length === 0 && (
                <div className={styles.emptyState}>Henüz davet edildiğin plan yok.</div>
              )}
            </div>
          </div>

          <div className={styles.tipCard}>
            <p className={styles.tipEyebrow}>Planlama İpucu</p>
            <p className={styles.tipText}>
              Her ürün için birden fazla seçenek ekleyebilir, fiyat ve link karşılaştırması yapabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      <button className={styles.fab} onClick={() => setIsModalOpen(true)} aria-label="Yeni plan oluştur">
        +
      </button>

      {isModalOpen && <CreateListModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default ListSelectorPage
