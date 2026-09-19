import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { Button } from '@shared/components/Button'
import { useCartStore, cartSubtotal, cartItemCount } from '@shared/stores/cart.store'
import type { CartItem } from '@shared/stores/cart.store'
import { MOCK_PRODUCTS } from '@modules/customer/features/catalogue/mock'
import { MOCK_STORES } from '@modules/customer/features/home/mock'

export function CartPage() {
  const { items, storeId, storeName, deliveryFee, clearCart } = useCartStore()
  const navigate = useNavigate()

  const subtotal = cartSubtotal(items)
  const total = subtotal + deliveryFee
  const count = cartItemCount(items)
  const store = MOCK_STORES.find(s => s.id === storeId)
  const minimumOrderValue = store?.minimumOrderValue ?? 0
  const shortfall = Math.max(0, minimumOrderValue - subtotal)

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={storeId ? `/customer/store/${storeId}` : '/customer/home'}
          className="underline-hover inline-flex items-center gap-1.5 text-xs font-semibold text-ink/55 transition-colors hover:text-ink"
        >
          <ArrowLeft size={13} />
          Continue shopping
        </Link>
        <button
          onClick={clearCart}
          className="underline-hover text-xs font-semibold text-ink/40 transition-colors hover:text-red-600"
        >
          Clear basket
        </button>
      </div>

      <div className="mb-6 flex items-baseline justify-between border-b border-ink/10 pb-5">
        <h1 className="font-display text-2xl font-medium tracking-[-0.01em] text-ink">Your basket</h1>
        <span className="text-xs text-ink/45">{count} item{count !== 1 ? 's' : ''} · {storeName}</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_300px]">
        <div className="divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm">
          {items.map(item => (
            <CartItemRow key={item.product.id} item={item} storeId={storeId ?? ''} />
          ))}
        </div>

        <OrderSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          minimumOrderValue={minimumOrderValue}
          shortfall={shortfall}
          storeName={storeName}
          onCheckout={() => navigate('/customer/checkout')}
        />
      </div>
    </div>
  )
}

// ─── Cart item row ──────────────────────────────────────────────────────────

function CartItemRow({ item, storeId }: { item: CartItem; storeId: string }) {
  const { updateQuantity } = useCartStore()
  const { product, quantity } = item

  const mockProduct = MOCK_PRODUCTS[storeId]?.find(p => p.id === product.id)
  const hint = mockProduct?.hint ?? ''
  const lineTotal = product.price * quantity

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : hint ? (
          <span className="absolute bottom-1.5 left-1.5 font-display text-[11px] leading-none text-ink/40">
            {hint}
          </span>
        ) : null}
      </div>

      {/* Name + unit */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
        <p className="mt-0.5 text-xs text-ink/45">
          {product.unit}
          <span className="mx-1.5 text-ink/20">·</span>
          £{(product.price / 100).toFixed(2)} each
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md border transition-colors',
            quantity === 1
              ? 'border-red-600/25 text-red-600 hover:bg-red-50'
              : 'border-ink/15 text-ink/60 hover:border-brand-600 hover:text-brand-600'
          )}
          aria-label={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
        >
          {quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
        </button>
        <span className="tabular w-5 text-center text-sm font-semibold text-ink">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/15 text-ink/60 transition-colors hover:border-brand-600 hover:text-brand-600"
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Line total */}
      <p className="tabular w-14 shrink-0 text-right font-display text-sm font-medium text-ink">
        £{(lineTotal / 100).toFixed(2)}
      </p>
    </div>
  )
}

// ─── Order summary ──────────────────────────────────────────────────────────

interface OrderSummaryProps {
  subtotal: number
  deliveryFee: number
  total: number
  minimumOrderValue: number
  shortfall: number
  storeName: string
  onCheckout: () => void
}

function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  minimumOrderValue,
  shortfall,
  storeName,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <div className="sticky top-24 rounded-xl border border-ink/10 bg-white shadow-sm">
      <div className="border-b border-ink/10 px-5 py-4">
        <p className="section-kicker text-[11px] font-semibold text-ink/45">Order summary</p>
        <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-ink">From {storeName}</h3>
      </div>

      <div className="space-y-2.5 px-5 py-4">
        <SummaryRow label="Subtotal" value={`£${(subtotal / 100).toFixed(2)}`} />
        <SummaryRow label="Delivery" value={`£${(deliveryFee / 100).toFixed(2)}`} />
        <div className="border-t border-ink/10 pt-2.5">
          <SummaryRow label="Total" value={`£${(total / 100).toFixed(2)}`} bold />
        </div>
      </div>

      {shortfall > 0 && (
        <div className="mx-5 mb-4 border-t border-ink/10 pt-3">
          <p className="text-xs leading-snug text-ink/55">
            Add <span className="font-semibold text-ink">£{(shortfall / 100).toFixed(2)}</span> more to reach the
            £{(minimumOrderValue / 100).toFixed(0)}.00 minimum.
          </p>
        </div>
      )}

      <div className="px-5 pb-5">
        <Button fullWidth disabled={shortfall > 0} onClick={onCheckout}>
          Go to checkout
          {shortfall === 0 && <ArrowRight size={14} className="ml-1.5" />}
        </Button>

        {shortfall > 0 && (
          <p className="mt-2 text-center text-[10px] text-ink/40">
            Minimum order £{(minimumOrderValue / 100).toFixed(0)}.00
          </p>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between', bold ? 'text-sm font-semibold text-ink' : 'text-xs text-ink/55')}>
      <span>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  )
}

// ─── Empty state ────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <ShoppingCart size={28} className="mb-4 text-ink/25" />
      <h2 className="font-display text-xl font-medium text-ink mb-1">Your basket is empty</h2>
      <p className="mb-6 max-w-xs text-sm text-ink/50">
        Head to a store and add some items to get started
      </p>
      <Link
        to="/customer/home"
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        Browse stores <ArrowRight size={14} />
      </Link>
    </div>
  )
}
