import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@shared/lib/utils'
import { useCartStore, cartSubtotal, cartItemCount } from '@shared/stores/cart.store'

interface BasketSidebarProps {
  minimumOrderValue: number
}

export function BasketSidebar({ minimumOrderValue }: BasketSidebarProps) {
  const navigate = useNavigate()
  const { items, deliveryFee, updateQuantity } = useCartStore()

  const subtotal = cartSubtotal(items)
  const total = subtotal + deliveryFee
  const count = cartItemCount(items)
  const shortfall = minimumOrderValue - subtotal

  return (
    <div className="sticky top-20 bg-white rounded-3xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Your basket</h3>
          <p className="mt-0.5 text-[11px] text-gray-400">One store per order at launch</p>
        </div>
        {count > 0 && (
          <span className="text-xs text-gray-400">{count} item{count !== 1 ? 's' : ''}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-5 text-gray-400">
          <ShoppingCart size={28} className="mb-2 opacity-25" />
          <p className="text-xs text-center">Add items to start your order</p>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="px-5 py-4 space-y-4 max-h-72 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">£{(product.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center tabular-nums">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-5 pb-4 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>£{(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery</span>
              <span>£{(deliveryFee / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>£{(total / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* Minimum order warning */}
          {shortfall > 0 && (
            <div className="mx-4 mb-3 px-3 py-2.5 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-700 leading-snug">
                Add <span className="font-semibold">£{(shortfall / 100).toFixed(2)}</span> more to reach
                the £{(minimumOrderValue / 100).toFixed(0)}.00 minimum.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="px-4 pb-4">
            <button
              disabled={shortfall > 0}
              onClick={() => navigate('/customer/checkout')}
              className={cn(
                'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors',
                shortfall > 0
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              )}
            >
              {shortfall > 0 ? 'Go to checkout' : 'Go to checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
