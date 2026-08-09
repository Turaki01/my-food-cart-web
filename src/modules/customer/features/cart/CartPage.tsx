import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { cn } from '@shared/lib/utils'
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
    <div className="max-w-4xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to={storeId ? `/customer/store/${storeId}` : '/customer/home'}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={13} />
          Continue shopping
        </Link>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear basket
        </button>
      </div>

      <div className="flex items-baseline justify-between mb-5">
        <h1 className="text-base font-semibold text-gray-900">Your basket</h1>
        <span className="text-xs text-gray-400">{count} item{count !== 1 ? 's' : ''} · {storeName}</span>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-[1fr_284px] gap-5 items-start">
        {/* Item list */}
        <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {items.map(item => (
            <CartItemRow key={item.product.id} item={item} storeId={storeId ?? ''} />
          ))}
        </div>

        {/* Order summary */}
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
      <div className="h-16 w-16 shrink-0 rounded-xl bg-stone-100 relative overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : hint ? (
          <span className="absolute bottom-1.5 left-1.5 text-[9px] text-stone-400 font-mono leading-none">
            {hint}
          </span>
        ) : null}
      </div>

      {/* Name + unit */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {product.unit}
          <span className="mx-1.5 text-gray-200">·</span>
          £{(product.price / 100).toFixed(2)} each
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className={cn(
            'h-7 w-7 rounded-full border flex items-center justify-center transition-colors',
            quantity === 1
              ? 'border-red-100 text-red-400 hover:bg-red-50'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          )}
          aria-label={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
        >
          {quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
        </button>
        <span className="w-5 text-center text-sm font-semibold tabular-nums">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="h-7 w-7 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Line total */}
      <p className="w-14 text-right text-sm font-semibold text-gray-900 shrink-0 tabular-nums">
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
    <div className="sticky top-20 bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Order summary</h3>
        <p className="text-xs text-gray-400 mt-0.5">From {storeName}</p>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <SummaryRow label="Subtotal" value={`£${(subtotal / 100).toFixed(2)}`} />
        <SummaryRow label="Delivery" value={`£${(deliveryFee / 100).toFixed(2)}`} />
        <div className="border-t border-gray-100 pt-2.5">
          <SummaryRow
            label="Total"
            value={`£${(total / 100).toFixed(2)}`}
            bold
          />
        </div>
      </div>

      {shortfall > 0 && (
        <div className="mx-4 mb-3 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs text-amber-700 leading-snug">
            Add{' '}
            <span className="font-semibold">£{(shortfall / 100).toFixed(2)}</span>
            {' '}more to reach the{' '}
            £{(minimumOrderValue / 100).toFixed(0)}.00 minimum.
          </p>
        </div>
      )}

      <div className="px-4 pb-4">
        <button
          disabled={shortfall > 0}
          onClick={onCheckout}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors',
            shortfall > 0
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          )}
        >
          Go to checkout
          {shortfall === 0 && <ArrowRight size={14} />}
        </button>

        {shortfall > 0 && (
          <p className="text-center text-[10px] text-stone-400 mt-2">
            Minimum order £{(minimumOrderValue / 100).toFixed(0)}.00
          </p>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between', bold ? 'text-sm font-semibold text-gray-900' : 'text-xs text-gray-500')}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

// ─── Empty state ────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="h-16 w-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <ShoppingCart size={28} className="text-stone-300" />
      </div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">Your basket is empty</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-xs">
        Head to a store and add some items to get started
      </p>
      <Link
        to="/customer/home"
        className="inline-flex items-center gap-1.5 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
      >
        Browse stores <ArrowRight size={14} />
      </Link>
    </div>
  )
}
