import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLists } from '@/features/lists/hooks/useLists'
import ListCard from '@/features/lists/components/ListCard'
import CreateListModal from '@/features/lists/components/CreateListModal'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { deleteList } from '@/features/lists/api/listsApi'
import { QUERY_KEYS } from '@/lib/queryKeys'
import styles from './ListSelectorPage.module.css'

const ListSelectorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: lists, isLoading, isError } = useLists()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()

  const { mutate: handleDelete } = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LISTS })
    },
  })

  const handleLogout = () => {
    clearAuth()
    sessionStorage.removeItem('refresh-token')
    window.location.href = '/login'
  }

  return (
    <div className={styles.page}>
      {/* Glassmorphism navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <div className={styles.navLogoMark}>2G</div>
          <span className={styles.navLogoName}>2Gather</span>
        </div>
        <div className={styles.navRight}>
          {user && (
            <span className={styles.userGreeting}>
              Merhaba, {user.displayName}
            </span>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Çıkış
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Page header — editorial asymmetry (DESIGN.md §6) */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeadline}>
            <span className={styles.pageLabel}>Listelerim</span>
            <h1 className={styles.pageTitle}>Planlarınız</h1>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            + Yeni Liste
          </Button>
        </div>

        {/* Content */}
        <div className={styles.grid}>
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </>
          )}

          {isError && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>Listeler yüklenemedi</p>
              <p className={styles.emptySubtitle}>Bir hata oluştu. Sayfayı yenilemeyi deneyin.</p>
            </div>
          )}

          {!isLoading && !isError && lists?.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>Henüz liste yok</p>
              <p className={styles.emptySubtitle}>
                İlk listenizi oluşturun ve planlamaya başlayın.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                İlk Listemi Oluştur
              </Button>
            </div>
          )}

          {!isLoading && !isError && lists?.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onDelete={handleDelete}
              canDelete={true}
            />
          ))}
        </div>
      </main>

      {isModalOpen && (
        <CreateListModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

export default ListSelectorPage
