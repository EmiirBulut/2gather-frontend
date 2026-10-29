import { useQueryClient } from '@tanstack/react-query'
import { invalidateListAggregates } from '@/lib/listCache'
import { useListStore } from '@/store/listStore'

/**
 * Mutations refresh the active list's derived data themselves instead of relying on the
 * SignalR echo, so the user's own changes show up even when the live connection is down.
 */
export function useInvalidateListData(): () => void {
  const queryClient = useQueryClient()
  const activeListId = useListStore((s) => s.activeListId)

  return () => {
    if (activeListId) invalidateListAggregates(queryClient, activeListId)
  }
}
