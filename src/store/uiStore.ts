import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemePreference = 'system' | 'light' | 'dark'

interface UiState {
  themePreference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

// Key is also read by the inline script in index.html to avoid a theme flash on load
export const UI_STORAGE_KEY = 'ui-preferences'

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
    }),
    {
      name: UI_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ themePreference: state.themePreference }),
    }
  )
)
