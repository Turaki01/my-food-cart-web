import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Copy, MapPin, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@shared/lib/utils'
import { useCartStore, type CartItem } from '@shared/stores/cart.store'
import { useCheckoutStore } from '@shared/stores/checkout.store'

interface OrderState {
  orderNumber: string
  storeName: string
  storeId: string
  items: CartItem[]
  address: { line1: string; line2?: string; postcode: string }
  deliverySlot: string
  deliveryNote?: string
  subtotal: number
  deliveryFee: number
  total: number
  phone?: string
}

export function OrderConfirmationPage() {
  const { state } = useLocation() as { state: OrderState | null }
  const [copied, setCopied] = useState(false)
  const clearCart = useCartStore(s => s.clearCart)
  const clearDraft = useCheckoutStore(s => s.clearDraft)

  // Cart/draft are cleared here, once the order is confirmed, rather than in
  // PaymentPage's submit handler — clearing them there raced the navigation
  // and could bounce back through the checkout guards to an empty cart.
  useEffect(() => {
    if (!state?.orderNumber) return
    clearCart()
    clearDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.orderNumber])

  if (!state?.orderNumber) return <Navigate to="/customer/home" replace />

  const {
    orderNumber,
    storeName,
    items,
    address,
    deliverySlot,
    deliveryNote,
    subtotal,
    deliveryFee,
    total,
    phone,
  } = state

  const referralCode = `MFC${orderNumber.replace('MFC-', '')}`
  const referralLink = `myfoodcart.co.uk/r/${referralCode.toLowerCase()}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${referralLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl py-4">
      {/* Success hero */}
      <div className="mb-8 border-b border-ink/10 pb-8 text-center">
        <p className="section-kicker flex items-center justify-center gap-1.5 text-[11px] font-semibold text-brand-700">
          <CheckCircle2 size={13} /> Order confirmed
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-[-0.01em] text-ink">Thanks — it's on its way</h1>
        <p className="mt-2 text-sm text-ink/55">
          Your order from <span className="font-semibold text-ink">{storeName}</span> is being prepared.
        </p>
      </div>

      {/* Order number */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-ink/10 bg-white px-6 py-5 shadow-sm">
        <div>
          <p className="section-kicker text-[11px] font-semibold text-ink/45">Order number</p>
          <p className="tabular mt-1 font-display text-lg font-medium text-ink">{orderNumber}</p>
        </div>
        <Link
          to={`/customer/orders/${orderNumber}`}
          className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Track order <ArrowRight size={12} />
        </Link>
      </div>

      {/* SMS notice */}
      {phone && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-sm">
          <MessageSquare size={15} className="mt-0.5 shrink-0 text-ink/40" />
          <p className="text-xs leading-relaxed text-ink/55">
            Order confirmation SMS sent to <span className="font-semibold text-ink">{phone}</span>
          </p>
        </div>
      )}

      {/* Order details */}
      <div className="mb-4 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-sm">
        {/* Items */}
        <div className="px-6 py-5">
          <p className="section-kicker mb-3 text-[11px] font-semibold text-ink/45">Items</p>
          <div className="space-y-2.5">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="tabular shrink-0 text-xs font-semibold text-ink/40">{quantity}×</span>
                  <span className="text-sm text-ink">{product.name}</span>
                </div>
                <span className="tabular text-xs font-medium text-ink/60">
                  £{((product.price * quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        <div className="space-y-3 px-6 py-5">
          <p className="section-kicker text-[11px] font-semibold text-ink/45">Delivery</p>
          <div className="flex items-start gap-2.5">
            <MapPin size={13} className="mt-0.5 shrink-0 text-ink/40" />
            <div>
              <p className="text-sm text-ink">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p className="text-xs text-ink/45">{address.postcode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={13} className="shrink-0 text-ink/40" />
            <p className="text-sm text-ink">{deliverySlot}</p>
          </div>
          {deliveryNote && (
            <p className="pl-[21px] text-xs italic text-ink/45">"{deliveryNote}"</p>
          )}
        </div>

        {/* Payment summary */}
        <div className="space-y-2 px-6 py-5">
          <p className="section-kicker mb-3 text-[11px] font-semibold text-ink/45">Payment</p>
          <ConfirmRow label="Subtotal" value={`£${(subtotal / 100).toFixed(2)}`} />
          <ConfirmRow label="Delivery" value={`£${(deliveryFee / 100).toFixed(2)}`} />
          <div className="border-t border-ink/10 pt-2">
            <ConfirmRow label="Total paid" value={`£${(total / 100).toFixed(2)}`} bold />
          </div>
        </div>
      </div>

      {/* Referral card */}
      <div className="mb-6 rounded-xl bg-brand-600 p-7 text-white shadow-sm">
        <p className="section-kicker text-[11px] font-semibold text-brand-100">Give £5, get £5</p>
        <h3 className="mt-2 font-display text-2xl font-medium leading-[1.05] tracking-[-0.01em]">
          Share your referral link
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-brand-50/80">
          When a friend completes their first order, you both get £5 credit.
        </p>
        <div className="mt-5 flex items-center gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5">
            <p className="truncate text-xs text-brand-50">{referralLink}</p>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors',
              copied ? 'bg-brand-800 text-white' : 'bg-white text-brand-700 hover:bg-brand-50'
            )}
          >
            <Copy size={11} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to="/customer/home"
          className="flex-1 rounded-lg border border-ink/15 bg-white py-3 text-center text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-gray-50"
        >
          Continue shopping
        </Link>
        <Link
          to={`/customer/orders/${orderNumber}`}
          className="flex-1 rounded-lg bg-brand-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          Track your order
        </Link>
      </div>
    </div>
  )
}

function ConfirmRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex justify-between', bold ? 'text-sm font-semibold text-ink' : 'text-xs text-ink/55')}>
      <span>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  )
}
