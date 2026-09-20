import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@shared/stores/cart.store'
import type { Order } from '@shared/types'

export function useReorder() {
  const navigate = useNavigate()
  const { clearCart, addItem, updateQuantity } = useCartStore()

  return (order: Order) => {
    const available = order.items.filter(item => item.product.inStock)
    if (available.length === 0) return

    clearCart()
    available.forEach(({ product, quantity }) => {
      addItem(product, order.storeId, order.storeName, order.deliveryFee)
      updateQuantity(product.id, quantity)
    })
    navigate('/customer/cart')
  }
}
