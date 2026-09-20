import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/components/Button'
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
    <aside className="sticky top-24 rounded-xl border border-ink/10 bg-white shadow-sm">
      <div className="border-b border-ink/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-kicker text-[11px] font-semibold text-ink/45">Your order</p>
            <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-ink">Basket</h3>
          </div>
          {count > 0 && <span className="text-xs font-semibold text-ink/50">{count} items</span>}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-ink/40">
          <ShoppingCart size={28} className="mb-2 opacity-40" />
          <p className="text-center text-xs">Add items to start your order</p>
        </div>
      ) : (
        <>
          <div className="max-h-72 space-y-4 overflow-y-auto px-5 py-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
                  <p className="mt-0.5 text-xs text-ink/50">£{(product.price / 100).toFixed(2)}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/15 text-ink/60 transition-colors hover:border-brand-600 hover:text-brand-600"
                    aria-label="Decrease"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="tabular w-4 text-center text-sm font-semibold text-ink">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md border border-ink/15 text-ink/60 transition-colors hover:border-brand-600 hover:text-brand-600"
                    aria-label="Increase"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-ink/10 px-5 pb-4 pt-4">
            <div className="flex justify-between text-xs text-ink/55">
              <span>Subtotal</span>
              <span className="tabular">£{(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-ink/55">
              <span>Delivery</span>
              <span className="tabular">£{(deliveryFee / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 text-sm font-semibold text-ink">
              <span>Total</span>
              <span className="tabular">£{(total / 100).toFixed(2)}</span>
            </div>
          </div>

          {shortfall > 0 && (
            <div className="mx-5 mb-4 border-t border-ink/10 pt-3">
              <p className="text-xs leading-snug text-ink/55">
                Add <span className="font-semibold text-ink">£{(shortfall / 100).toFixed(2)}</span> more to reach the
                £{(minimumOrderValue / 100).toFixed(0)} minimum.
              </p>
            </div>
          )}

          <div className="px-5 pb-5">
            <Button fullWidth disabled={shortfall > 0} onClick={() => navigate('/customer/checkout')}>
              Go to checkout
            </Button>
          </div>
        </>
      )}
    </aside>
  )
}
