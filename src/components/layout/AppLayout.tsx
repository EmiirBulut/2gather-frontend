import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useSignalR } from '@/hooks/useSignalR'
import { useListStore } from '@/store/listStore'
import { Sidebar } from './Sidebar'
import styles from './AppLayout.module.css'

// Every /lists/:listId/* page renders here, so the realtime connection and the
// list group membership live for the whole list session (not just some pages)
export const AppLayout = () => {
  const { listId } = useParams<{ listId: string }>()
  const setActiveListId = useListStore((s) => s.setActiveListId)

  useEffect(() => {
    setActiveListId(listId ?? null)
    return () => setActiveListId(null)
  }, [listId, setActiveListId])

  useSignalR()

  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
