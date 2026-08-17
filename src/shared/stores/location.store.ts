import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationState {
  hasCompletedZoneCheck: boolean
  deliveryArea: string | null
  postcode: string | null

  setZoneCheckComplete: (area: string, postcode: string) => void
  resetZoneCheck: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      hasCompletedZoneCheck: false,
      deliveryArea: null,
      postcode: null,

      setZoneCheckComplete: (area, postcode) =>
        set({ hasCompletedZoneCheck: true, deliveryArea: area, postcode }),
      resetZoneCheck: () => set({ hasCompletedZoneCheck: false, deliveryArea: null, postcode: null }),
    }),
    { name: 'mfc-location' }
  )
)
