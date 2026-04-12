import { create } from 'zustand'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ListState {
  activeListId: string | null
  setActiveListId: (id: string | null) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useListStore = create<ListState>()((set) => ({
  activeListId: null,

  setActiveListId: (id) => set({ activeListId: id }),
}))
