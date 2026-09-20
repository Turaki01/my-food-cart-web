import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MockStore } from '@modules/customer/features/home/mock'
import { MOCK_STORES } from '@modules/customer/features/home/mock'

// Single source of truth for the store directory — customer browsing (Home,
// catalogue, checkout, cart) and admin's "onboard a store" both read/write
// here, so a store admin adds actually shows up for customers immediately
// (same reasoning as unifying orders — see ops_dispatch_and_order_sync memory).
interface StoresState {
  stores: MockStore[]
  addStore: (store: MockStore) => void
  updateStore: (storeId: string, patch: Partial<MockStore>) => void
}

export const useStoresStore = create<StoresState>()(
  persist(
    (set, get) => ({
      stores: MOCK_STORES,

      addStore: (store) => set({ stores: [...get().stores, store] }),

      updateStore: (storeId, patch) =>
        set({ stores: get().stores.map(s => (s.id === storeId ? { ...s, ...patch } : s)) }),
    }),
    { name: 'mfc-stores' }
  )
)
