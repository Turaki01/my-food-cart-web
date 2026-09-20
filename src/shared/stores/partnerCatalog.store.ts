import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MockProduct } from '@modules/customer/features/catalogue/mock'
import { PARTNER_PRODUCTS, PARTNER_STORE_ID } from '@modules/store-partner/mock'

export interface PartnerProduct extends MockProduct {
  quantity: number
  // Lets a partner hide an item even while quantity > 0 (e.g. a quality issue) —
  // independent of the quantity-driven stock count.
  manuallyUnavailable: boolean
}

export interface NewProductInput {
  name: string
  category: string
  unit: string
  price: number
  quantity: number
  imageUrl?: string
}

function computeInStock(quantity: number, manuallyUnavailable: boolean) {
  return quantity > 0 && !manuallyUnavailable
}

const SEED_PRODUCTS: PartnerProduct[] = PARTNER_PRODUCTS.map(p => ({
  ...p,
  quantity: p.inStock ? 20 : 0,
  manuallyUnavailable: false,
}))

interface PartnerCatalogState {
  products: PartnerProduct[]
  updateQuantity: (productId: string, quantity: number) => void
  toggleManualOverride: (productId: string) => void
  updatePrice: (productId: string, price: number) => void
  updateImage: (productId: string, imageUrl: string) => void
  addProduct: (input: NewProductInput) => void
  removeProduct: (productId: string) => void
}

export const usePartnerCatalogStore = create<PartnerCatalogState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,

      updateQuantity: (productId, quantity) =>
        set({
          products: get().products.map(p => {
            if (p.id !== productId) return p
            const nextQuantity = Math.max(0, quantity)
            return { ...p, quantity: nextQuantity, inStock: computeInStock(nextQuantity, p.manuallyUnavailable) }
          }),
        }),

      toggleManualOverride: (productId) =>
        set({
          products: get().products.map(p => {
            if (p.id !== productId) return p
            const nextOverride = !p.manuallyUnavailable
            return { ...p, manuallyUnavailable: nextOverride, inStock: computeInStock(p.quantity, nextOverride) }
          }),
        }),

      updatePrice: (productId, price) =>
        set({
          products: get().products.map(p => (p.id === productId ? { ...p, price } : p)),
        }),

      updateImage: (productId, imageUrl) =>
        set({
          products: get().products.map(p => (p.id === productId ? { ...p, imageUrl } : p)),
        }),

      addProduct: (input) =>
        set({
          products: [
            ...get().products,
            {
              id: `p-${Date.now().toString(36)}`,
              storeId: PARTNER_STORE_ID,
              hint: input.name.toLowerCase(),
              name: input.name,
              category: input.category,
              unit: input.unit,
              price: input.price,
              imageUrl: input.imageUrl,
              quantity: input.quantity,
              manuallyUnavailable: false,
              inStock: computeInStock(input.quantity, false),
            },
          ],
        }),

      removeProduct: (productId) =>
        set({ products: get().products.filter(p => p.id !== productId) }),
    }),
    { name: 'mfc-partner-catalog-v2' }
  )
)
