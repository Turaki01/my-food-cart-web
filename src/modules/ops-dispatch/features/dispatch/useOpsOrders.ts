import { useOrdersStore } from '@shared/stores/orders.store'

// Ops sees every store's orders (unlike the store-partner view, which is
// scoped to one store) but can only act on the handoff step: marking an
// order that's "on the way" as delivered, optionally recording who took it.
export function useOpsOrders() {
  const orders = useOrdersStore(s => s.orders)
  const setStatus = useOrdersStore(s => s.setStatus)

  const markDelivered = (orderId: string, courierName?: string) => {
    setStatus(orderId, 'delivered', courierName ? { courierName } : undefined)
  }

  return { orders, markDelivered }
}
