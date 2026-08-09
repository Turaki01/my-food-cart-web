import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Copy, MapPin, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@shared/lib/utils'
import type { CartItem } from '@shared/stores/cart.store'

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
    <div className="max-w-2xl mx-auto py-4">

      {/* Success hero */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          <div className="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center">
            <CheckCircle2 size={36} className="text-brand-600" />
          </div>
          {/* Ping animation */}
          <span className="absolute inset-0 rounded-full bg-brand-200 animate-ping opacity-30" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-1">Order confirmed!</h1>
        <p className="text-sm text-gray-500">
          Your order from <span className="font-medium text-gray-800">{storeName}</span> is being prepared.
        </p>
      </div>

      {/* Order number */}
      <div className="bg-white rounded-3xl border border-gray-100 px-5 py-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Order number</p>
          <p className="text-base font-bold text-gray-900 mt-0.5 tabular-nums">{orderNumber}</p>
        </div>
        <Link
          to={`/customer/orders/${orderNumber}`}
          className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Track order <ArrowRight size={12} />
        </Link>
      </div>

      {/* SMS notice */}
      {phone && (
        <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-3 mb-4">
          <MessageSquare size={15} className="text-brand-600 shrink-0 mt-0.5" />
          <p className="text-xs text-brand-700 leading-relaxed">
            Order confirmation SMS sent to <span className="font-semibold">{phone}</span>
          </p>
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-4">
        {/* Items */}
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</h3>
          <div className="space-y-2.5">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] text-stone-400 shrink-0 font-medium">
                    {quantity}×
                  </span>
                  <span className="text-sm text-gray-800">{product.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-600 tabular-nums">
                  £{((product.price * quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        <div className="px-5 py-4 border-b border-gray-50 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</h3>
          <div className="flex items-start gap-2.5">
            <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-800">{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p className="text-xs text-gray-400">{address.postcode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={13} className="text-gray-400 shrink-0" />
            <p className="text-sm text-gray-800">{deliverySlot}</p>
          </div>
          {deliveryNote && (
            <p className="text-xs text-gray-400 pl-[21px] italic">"{deliveryNote}"</p>
          )}
        </div>

        {/* Payment summary */}
        <div className="px-5 py-4 space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment</h3>
          <ConfirmRow label="Subtotal"  value={`£${(subtotal  / 100).toFixed(2)}`} />
          <ConfirmRow label="Delivery"  value={`£${(deliveryFee / 100).toFixed(2)}`} />
          <div className="pt-2 border-t border-gray-100">
            <ConfirmRow label="Total paid" value={`£${(total / 100).toFixed(2)}`} bold />
          </div>
        </div>
      </div>

      {/* Referral card */}
      <div className="bg-brand-700 rounded-3xl px-5 py-5 mb-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)` }}
        />
        <div className="relative">
          <p className="text-xs font-semibold text-brand-200 uppercase tracking-wider mb-1">Give £5, get £5</p>
          <p className="text-sm font-bold text-white mb-1">Share your referral link</p>
          <p className="text-xs text-brand-200 mb-4 leading-relaxed">
            When a friend completes their first order, you both get £5 credit.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 min-w-0">
              <p className="text-xs text-brand-100 truncate font-mono">{referralLink}</p>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                copied
                  ? 'bg-brand-400 text-white'
                  : 'bg-white text-brand-700 hover:bg-brand-50'
              )}
            >
              <Copy size={11} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to="/customer/home"
          className="flex-1 text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 transition-colors"
        >
          Continue shopping
        </Link>
        <Link
          to={`/customer/orders/${orderNumber}`}
          className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          Track your order
        </Link>
      </div>

    </div>
  )
}

function ConfirmRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex justify-between', bold ? 'text-sm font-semibold text-gray-900' : 'text-xs text-gray-500')}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
