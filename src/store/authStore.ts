import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string
  email: string
  displayName: string
}

interface AuthState {
  accessToken: string | null
  user: UserDto | null
  setAuth: (token: string, user: UserDto) => void
  clearAuth: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      setAuth: (token, user) => set({ accessToken: token, user }),

      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist token + user — no functions
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
)
