import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@shared/types'

interface AuthState {
  user: User | null
  pendingPhone: string | null

  setPendingPhone: (phone: string) => void
  setUser: (user: User) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingPhone: null,

      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      setUser: (user) => set({ user }),
      signOut: () => set({ user: null, pendingPhone: null }),
    }),
    {
      name: 'mfc-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
