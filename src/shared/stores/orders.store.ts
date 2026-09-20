import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, OrderStatus } from '@shared/types'
import { MOCK_ORDERS } from '@modules/customer/features/orders/mock'

// Single source of truth for order state — read by customer order history,
// the store-partner dashboard, and the ops-dispatch board, and written to by
// checkout (new order), the partner (accept/prepare), and ops (deliver).
// This is what makes "mark delivered" in ops actually show up everywhere else.
interface OrdersState {
  orders: Order[]
  addOrder: (order: Order) => void
  setStatus: (orderId: string, status: OrderStatus, patch?: Partial<Order>) => void
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,

      addOrder: (order) => set({ orders: [order, ...get().orders] }),

      setStatus: (orderId, status, patch) =>
        set({
          orders: get().orders.map(o => (o.id === orderId ? { ...o, ...patch, status } : o)),
        }),
    }),
    { name: 'mfc-orders' }
  )
)
