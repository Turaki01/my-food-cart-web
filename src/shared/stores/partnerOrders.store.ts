import type { OrderStatus } from '@shared/types'
import { PARTNER_STORE_ID } from '@modules/store-partner/mock'
import { useOrdersStore } from './orders.store'

// A store partner can move an order forward up to "handed off for delivery" —
// marking it "delivered" is ops-dispatch's job, not the store's.
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: 'being_picked',
  being_picked: 'on_the_way',
}

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

// Thin, store-scoped view over the shared orders store — this store partner
// only ever sees and acts on orders placed at their own store.
export function usePartnerOrdersStore() {
  // Select the raw (referentially stable) array and filter in the hook body,
  // not inside the selector — filtering inside the selector would return a
  // new array every call and make useSyncExternalStore loop indefinitely.
  const allOrders = useOrdersStore(s => s.orders)
  const setStatus = useOrdersStore(s => s.setStatus)
  const orders = allOrders.filter(o => o.storeId === PARTNER_STORE_ID)

  const advanceStatus = (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    const next = order ? NEXT_STATUS[order.status] : undefined
    if (next) setStatus(orderId, next)
  }

  return { orders, advanceStatus }
}
