import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CheckoutDetailsFormValues } from '@modules/customer/features/checkout/checkout.schema'

interface CheckoutDraftState {
  draft: CheckoutDetailsFormValues | null
  setDraft: (draft: CheckoutDetailsFormValues) => void
  clearDraft: () => void
}

export const useCheckoutStore = create<CheckoutDraftState>()(
  persist(
    set => ({
      draft: null,
      setDraft: draft => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'mfc-checkout-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
)
