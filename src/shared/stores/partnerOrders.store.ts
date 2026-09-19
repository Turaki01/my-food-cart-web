import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, OrderStatus } from '@shared/types'
import { PARTNER_ORDERS } from '@modules/store-partner/mock'

// A store partner can move an order forward up to "handed off for delivery" —
// marking it "delivered" is the courier/ops side's job, not the store's.
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: 'being_picked',
  being_picked: 'on_the_way',
}

interface PartnerOrdersState {
  orders: Order[]
  advanceStatus: (orderId: string) => void
}

export const usePartnerOrdersStore = create<PartnerOrdersState>()(
  persist(
    (set, get) => ({
      orders: PARTNER_ORDERS,

      advanceStatus: (orderId) => {
        const next = NEXT_STATUS[get().orders.find(o => o.id === orderId)?.status as OrderStatus]
        if (!next) return
        set({
          orders: get().orders.map(o => (o.id === orderId ? { ...o, status: next } : o)),
        })
      },
    }),
    { name: 'mfc-partner-orders' }
  )
)

export function nextOrderAction(status: OrderStatus): string | null {
  switch (status) {
    case 'confirmed':
      return 'Accept & start picking'
    case 'being_picked':
      return 'Mark ready for delivery'
    default:
      return null
  }
}
