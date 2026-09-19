import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MockStore } from '@modules/customer/features/home/mock'
import { PARTNER_STORE } from '@modules/store-partner/mock'
import { defaultHours, type DayHours } from '@modules/store-partner/lib/hours'

export interface PartnerStoreProfile extends MockStore {
  hours: DayHours[]
  // When enabled, `manualOverrideValue` decides open/closed regardless of `hours`
  // — e.g. pausing early because an item sold out, without editing the schedule.
  manualOverride: boolean
  manualOverrideValue: boolean
}

interface PartnerStoreState {
  profile: PartnerStoreProfile
  updateProfile: (patch: Partial<Omit<PartnerStoreProfile, 'hours'>>) => void
  updateDayHours: (day: DayHours['day'], patch: Partial<Omit<DayHours, 'day'>>) => void
  setManualOverride: (enabled: boolean, value?: boolean) => void
}

export const usePartnerStoreProfile = create<PartnerStoreState>()(
  persist(
    (set, get) => ({
      profile: {
        ...PARTNER_STORE,
        hours: defaultHours(),
        manualOverride: false,
        manualOverrideValue: PARTNER_STORE.isOpen,
      },

      updateProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),

      updateDayHours: (day, patch) =>
        set({
          profile: {
            ...get().profile,
            hours: get().profile.hours.map(h => (h.day === day ? { ...h, ...patch } : h)),
          },
        }),

      setManualOverride: (enabled, value) =>
        set({
          profile: {
            ...get().profile,
            manualOverride: enabled,
            manualOverrideValue: value ?? get().profile.manualOverrideValue,
          },
        }),
    }),
    { name: 'mfc-partner-store-profile-v2' }
  )
)
