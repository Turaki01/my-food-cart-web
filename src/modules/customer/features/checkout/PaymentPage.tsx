import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useAuthStore } from '@shared/stores/auth.store'
import { useCartStore, cartSubtotal } from '@shared/stores/cart.store'
import { useCheckoutStore } from '@shared/stores/checkout.store'
import { MockCardPayment } from './components/MockCardPayment'
import { TEST_CARD_DECLINE, generateDeliverySlots, paymentSchema, type PaymentFormValues } from './checkout.schema'

export function PaymentPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { items, storeId, storeName, deliveryFee, clearCart } = useCartStore()
  const { draft, clearDraft } = useCheckoutStore()

  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = cartSubtotal(items)
  const total = subtotal + deliveryFee
  const slots = generateDeliverySlots()
  const selectedSlot = draft ? slots.find(slot => slot.id === draft.deliverySlot) : null

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  })

  if (items.length === 0) return <Navigate to="/customer/cart" replace />
  if (!draft) return <Navigate to="/customer/checkout" replace />
  if (!user) return <Navigate to="/auth/phone" state={{ from: '/customer/payment' }} replace />

  const onSubmit = async (data: PaymentFormValues) => {
    setPaymentError(null)
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 1400))

    if (data.cardNumber.replace(/\s/g, '') === TEST_CARD_DECLINE) {
      setPaymentError('Your card was declined. Try a different card.')
      setIsSubmitting(false)
      return
    }

    const orderNumber = `MFC-${Date.now().toString(36).toUpperCase().slice(-6)}`

    navigate('/customer/order-confirmation', {
      replace: true,
      state: {
        orderNumber,
        storeName,
        storeId,
        items: [...items],
        address: { line1: draft.line1, line2: draft.line2, postcode: draft.postcode.toUpperCase() },
        deliverySlot: selectedSlot?.label ?? draft.deliverySlot,
        deliveryNote: draft.deliveryNote,
        subtotal,
        deliveryFee,
        total,
        phone: user.phone,
      },
    })

    clearCart()
    clearDraft()
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/customer/checkout"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft size={13} />
        Back to checkout
      </Link>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker text-[11px] font-bold text-brand-600">Secure payment</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900">Payment</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your order and complete payment on this final step.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 sm:flex">
          Step 2 of 2
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-100 bg-white px-5 py-5">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-900">Card details</h3>
              </div>
              <MockCardPayment control={control} errors={errors} />

              {paymentError && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">
                  <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-xs leading-snug text-red-600">{paymentError}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white px-5 py-5">
              <div className="mb-4 flex items-center gap-2">
                <LockKeyhole size={16} className="text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-900">Billing summary</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                  <span>Store</span>
                  <span className="font-semibold text-gray-900">{storeName}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                  <span>Deliver to</span>
                  <span className="max-w-[14rem] text-right font-semibold text-gray-900">
                    {draft.line1}, {draft.postcode}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                  <span>Delivery slot</span>
                  <span className="font-semibold text-gray-900">{selectedSlot?.label ?? draft.deliverySlot}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-20">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
              <div className="border-b border-gray-50 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Pay now</h3>
                <p className="mt-0.5 text-xs text-gray-400">
                  {items.length} item{items.length !== 1 ? 's' : ''} · {storeName}
                </p>
              </div>

              <div className="max-h-52 space-y-2 overflow-y-auto px-5 py-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3">
                    <span className="truncate text-xs leading-snug text-gray-600">
                      {quantity} × {product.name}
                    </span>
                    <span className="shrink-0 text-xs font-medium tabular-nums text-gray-900">
                      £{((product.price * quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-50 px-5 pb-4 pt-3">
                <SummaryRow label="Subtotal" value={`£${(subtotal / 100).toFixed(2)}`} />
                <SummaryRow label="Delivery" value={`£${(deliveryFee / 100).toFixed(2)}`} />
                <div className="border-t border-gray-100 pt-2">
                  <SummaryRow label="Amount due" value={`£${(total / 100).toFixed(2)}`} bold />
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full rounded-2xl py-3 text-sm font-semibold transition-all',
                    isSubmitting
                      ? 'cursor-wait bg-brand-400 text-white'
                      : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.99]'
                  )}
                >
                  {isSubmitting ? 'Processing payment...' : `Pay £${(total / 100).toFixed(2)}`}
                </button>
                <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-gray-400">
                  <ShieldCheck size={10} /> Mock payment page - Stripe test mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

function SummaryRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex justify-between', bold ? 'text-sm font-semibold text-gray-900' : 'text-xs text-gray-500')}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
