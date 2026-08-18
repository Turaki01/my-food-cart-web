import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@shared/lib/utils'
import { useCartStore, cartItemCount, cartSubtotal } from '@shared/stores/cart.store'

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
    <aside className="sticky top-24 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_22px_44px_-36px_rgba(15,23,42,0.2)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-kicker text-[11px] font-bold text-brand-600">Your order</p>
            <h3 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900">Basket</h3>
          </div>
          {count > 0 && <span className="text-xs font-semibold text-slate-500">{count} items</span>}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-slate-400">
          <ShoppingCart size={28} className="mb-2 opacity-25" />
          <p className="text-center text-xs">Add items to start your order</p>
        </div>
      ) : (
        <>
          <div className="max-h-72 space-y-4 overflow-y-auto px-5 py-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-slate-900">{product.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">£{(product.price / 100).toFixed(2)}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300"
                    aria-label="Decrease"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="w-4 text-center text-sm font-bold text-slate-900 tabular-nums">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300"
                    aria-label="Increase"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-100 px-5 pb-4 pt-4">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>£{(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Delivery</span>
              <span>£{(deliveryFee / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
              <span>Total</span>
              <span>£{(total / 100).toFixed(2)}</span>
            </div>
          </div>

          {shortfall > 0 && (
            <div className="mx-4 mb-3 rounded-[1.2rem] bg-brand-50 px-3 py-2.5">
              <p className="text-xs leading-snug text-brand-700">
                Add <span className="font-bold">£{(shortfall / 100).toFixed(2)}</span> more to reach the
                £{(minimumOrderValue / 100).toFixed(0)} minimum.
              </p>
            </div>
          )}

          <div className="px-4 pb-4">
            <button
              disabled={shortfall > 0}
              onClick={() => navigate('/customer/checkout')}
              className={cn(
                'w-full rounded-2xl py-3 text-sm font-bold transition-colors',
                shortfall > 0
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              )}
            >
              Go to checkout
            </button>
          </div>
        </>
      )}
    </aside>
  )
}
