import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@shared/types'

interface AuthState {
  user: User | null
  pendingPhone: string | null
  hasCompletedZoneCheck: boolean
  deliveryArea: string | null

  setPendingPhone: (phone: string) => void
  setUser: (user: User) => void
  setZoneCheckComplete: (area: string) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingPhone: null,
      hasCompletedZoneCheck: false,
      deliveryArea: null,

      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      setUser: (user) => set({ user }),
      setZoneCheckComplete: (area) => set({ hasCompletedZoneCheck: true, deliveryArea: area }),
      signOut: () => set({ user: null, pendingPhone: null, hasCompletedZoneCheck: false, deliveryArea: null }),
    }),
    {
      name: 'mfc-auth',
      partialize: (state) => ({
        user: state.user,
        hasCompletedZoneCheck: state.hasCompletedZoneCheck,
        deliveryArea: state.deliveryArea,
      }),
    }
  )
)
