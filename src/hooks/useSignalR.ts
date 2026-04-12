import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { connect, disconnect, joinList, leaveList, onEvent } from '@/services/signalR'
import { useAuthStore } from '@/store/authStore'
import { useListStore } from '@/store/listStore'
import { QUERY_KEYS } from '@/lib/queryKeys'
import type { ItemDto } from '@/features/items/types'
import type { ItemOptionDto } from '@/features/options/types'
import type { MemberDto } from '@/features/members/types'

// ─── SignalR event payload shapes ────────────────────────────────────────────

interface ItemAddedPayload {
  listId: string
  item: ItemDto
}

interface ItemUpdatedPayload {
  listId: string
  item: ItemDto
}

interface ItemPurchasedPayload {
  listId: string
  itemId: string
  purchasedAt: string
}

interface ItemDeletedPayload {
  listId: string
  itemId: string
}

interface OptionAddedPayload {
  itemId: string
  option: ItemOptionDto
}

interface OptionUpdatedPayload {
  itemId: string
  option: ItemOptionDto
}

interface OptionDeletedPayload {
  itemId: string
  optionId: string
}

interface MemberJoinedPayload {
  listId: string
  member: MemberDto
}

interface MemberRemovedPayload {
  listId: string
  userId: string
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSignalR(): void {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((s) => s.accessToken)
  const activeListId = useListStore((s) => s.activeListId)

  // Track joined list to call leaveList on change
  const joinedListRef = useRef<string | null>(null)

  // Connect / disconnect based on auth state
  useEffect(() => {
    if (!accessToken) return

    connect().catch(() => {
      // Connection failure is non-fatal — will retry via auto-reconnect
    })

    return () => {
      disconnect()
    }
  }, [accessToken])

  // Join / leave list group when activeListId changes
  useEffect(() => {
    if (!accessToken) return

    const prev = joinedListRef.current

    if (prev && prev !== activeListId) {
      leaveList(prev).catch(() => {})
    }

    if (activeListId) {
      joinList(activeListId).catch(() => {})
      joinedListRef.current = activeListId
    } else {
      joinedListRef.current = null
    }
  }, [accessToken, activeListId])

  // Register event handlers
  useEffect(() => {
    if (!accessToken) return

    const offs: Array<() => void> = []

    // ── Items ──────────────────────────────────────────────────────────────

    offs.push(
      onEvent<ItemAddedPayload>('ItemAdded', ({ listId, item }) => {
        for (const status of ['Pending', 'All'] as const) {
          queryClient.setQueryData<ItemDto[]>(
            QUERY_KEYS.ITEMS(listId, status),
            (old) => (old ? [...old, item] : [item])
          )
        }
      })
    )

    offs.push(
      onEvent<ItemUpdatedPayload>('ItemUpdated', ({ listId, item }) => {
        for (const status of ['Pending', 'Purchased', 'All'] as const) {
          queryClient.setQueryData<ItemDto[]>(
            QUERY_KEYS.ITEMS(listId, status),
            (old) => old?.map((i) => (i.id === item.id ? item : i))
          )
        }
      })
    )

    offs.push(
      onEvent<ItemPurchasedPayload>('ItemPurchased', ({ listId, itemId, purchasedAt }) => {
        // Remove from Pending, update in Purchased + All
        queryClient.setQueryData<ItemDto[]>(
          QUERY_KEYS.ITEMS(listId, 'Pending'),
          (old) => old?.filter((i) => i.id !== itemId)
        )
        queryClient.setQueryData<ItemDto[]>(
          QUERY_KEYS.ITEMS(listId, 'Purchased'),
          (old) => {
            if (!old) return old
            return old.map((i) =>
              i.id === itemId ? { ...i, status: 'Purchased' as const, purchasedAt } : i
            )
          }
        )
        queryClient.setQueryData<ItemDto[]>(
          QUERY_KEYS.ITEMS(listId, 'All'),
          (old) =>
            old?.map((i) =>
              i.id === itemId ? { ...i, status: 'Purchased' as const, purchasedAt } : i
            )
        )
      })
    )

    offs.push(
      onEvent<ItemDeletedPayload>('ItemDeleted', ({ listId, itemId }) => {
        for (const status of ['Pending', 'Purchased', 'All'] as const) {
          queryClient.setQueryData<ItemDto[]>(
            QUERY_KEYS.ITEMS(listId, status),
            (old) => old?.filter((i) => i.id !== itemId)
          )
        }
      })
    )

    // ── Options ────────────────────────────────────────────────────────────

    offs.push(
      onEvent<OptionAddedPayload>('OptionAdded', ({ itemId, option }) => {
        queryClient.setQueryData<ItemOptionDto[]>(
          QUERY_KEYS.OPTIONS(itemId),
          (old) => (old ? [...old, option] : [option])
        )
      })
    )

    offs.push(
      onEvent<OptionUpdatedPayload>('OptionUpdated', ({ itemId, option }) => {
        queryClient.setQueryData<ItemOptionDto[]>(
          QUERY_KEYS.OPTIONS(itemId),
          (old) => old?.map((o) => (o.id === option.id ? option : o))
        )
      })
    )

    offs.push(
      onEvent<OptionDeletedPayload>('OptionDeleted', ({ itemId, optionId }) => {
        queryClient.setQueryData<ItemOptionDto[]>(
          QUERY_KEYS.OPTIONS(itemId),
          (old) => old?.filter((o) => o.id !== optionId)
        )
      })
    )

    // ── Members ────────────────────────────────────────────────────────────

    offs.push(
      onEvent<MemberJoinedPayload>('MemberJoined', ({ listId, member }) => {
        queryClient.setQueryData<MemberDto[]>(
          QUERY_KEYS.MEMBERS(listId),
          (old) => {
            if (!old) return [member]
            const exists = old.some((m) => m.userId === member.userId)
            return exists ? old : [...old, member]
          }
        )
      })
    )

    offs.push(
      onEvent<MemberRemovedPayload>('MemberRemoved', ({ listId, userId }) => {
        queryClient.setQueryData<MemberDto[]>(
          QUERY_KEYS.MEMBERS(listId),
          (old) => old?.filter((m) => m.userId !== userId)
        )
      })
    )

    return () => offs.forEach((off) => off())
  }, [accessToken, queryClient])
}
