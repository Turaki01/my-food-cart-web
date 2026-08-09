import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@shared/types'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  storeId: string | null
  storeName: string
  deliveryFee: number
  items: CartItem[]

  addItem: (
    product: Product,
    storeId: string,
    storeName: string,
    deliveryFee: number
  ) => 'ok' | 'conflict'

  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  getQuantity: (productId: string) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      storeId: null,
      storeName: '',
      deliveryFee: 349,
      items: [],

      addItem: (product, storeId, storeName, deliveryFee) => {
        const { storeId: currentStore, items } = get()

        if (currentStore !== null && currentStore !== storeId && items.length > 0) {
          return 'conflict'
        }

        const existing = items.find(i => i.product.id === product.id)

        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ storeId, storeName, deliveryFee, items: [...items, { product, quantity: 1 }] })
        }

        return 'ok'
      },

      updateQuantity: (productId, qty) => {
        const { items } = get()
        if (qty <= 0) {
          const updated = items.filter(i => i.product.id !== productId)
          set({ items: updated, ...(updated.length === 0 ? { storeId: null, storeName: '' } : {}) })
        } else {
          set({ items: items.map(i => (i.product.id === productId ? { ...i, quantity: qty } : i)) })
        }
      },

      clearCart: () => set({ storeId: null, storeName: '', items: [], deliveryFee: 349 }),

      getQuantity: (productId) =>
        get().items.find(i => i.product.id === productId)?.quantity ?? 0,
    }),
    {
      name: 'mfc-cart',
      partialize: (state) => ({
        storeId: state.storeId,
        storeName: state.storeName,
        deliveryFee: state.deliveryFee,
        items: state.items,
      }),
    }
  )
)

// Derived values — call outside the store to keep it lean
export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
}

export function cartItemCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}
