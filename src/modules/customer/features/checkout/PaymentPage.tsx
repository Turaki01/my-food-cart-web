import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, CreditCard, LockKeyhole, ShieldCheck } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { Button } from '@shared/components/Button'
import { useAuthStore } from '@shared/stores/auth.store'
import { useCartStore, cartSubtotal } from '@shared/stores/cart.store'
import { useCheckoutStore } from '@shared/stores/checkout.store'
import { MockCardPayment } from './components/MockCardPayment'
import { TEST_CARD_DECLINE, generateDeliverySlots, paymentSchema, type PaymentFormValues } from './checkout.schema'

export function PaymentPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { items, storeId, storeName, deliveryFee } = useCartStore()
  const { draft } = useCheckoutStore()

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
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/customer/checkout"
        className="underline-hover mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/55 transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} />
        Back to checkout
      </Link>

      <div className="mb-6 flex items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="section-kicker text-[11px] font-semibold text-ink/45">Secure payment · Step 2 of 2</p>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Payment</h1>
          <p className="mt-2 text-sm text-ink/55">
            Review your order and complete payment on this final step.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-xl border border-ink/10 bg-white px-6 py-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-ink/60" />
                <h3 className="font-display text-lg font-medium text-ink">Card details</h3>
              </div>
              <MockCardPayment control={control} errors={errors} />

              {paymentError && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-600/25 bg-red-50 px-3 py-2.5">
                  <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-600" />
                  <p className="text-xs leading-snug text-red-700">{paymentError}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-ink/10 bg-white px-6 py-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <LockKeyhole size={16} className="text-ink/60" />
                <h3 className="font-display text-lg font-medium text-ink">Billing summary</h3>
              </div>
              <div className="divide-y divide-ink/10 text-sm">
                <div className="flex items-center justify-between py-3 first:pt-0">
                  <span className="text-ink/55">Store</span>
                  <span className="font-semibold text-ink">{storeName}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-ink/55">Deliver to</span>
                  <span className="max-w-[14rem] text-right font-semibold text-ink">
                    {draft.line1}, {draft.postcode}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 last:pb-0">
                  <span className="text-ink/55">Delivery slot</span>
                  <span className="font-semibold text-ink">{selectedSlot?.label ?? draft.deliverySlot}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-24">
            <div className="rounded-xl border border-ink/10 bg-white shadow-sm">
              <div className="border-b border-ink/10 px-5 py-4">
                <p className="section-kicker text-[11px] font-semibold text-ink/45">Pay now</p>
                <h3 className="mt-1 font-display text-lg font-medium text-ink">
                  {items.length} item{items.length !== 1 ? 's' : ''} · {storeName}
                </h3>
              </div>

              <div className="max-h-52 space-y-2 overflow-y-auto px-5 py-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3">
                    <span className="truncate text-xs leading-snug text-ink/60">
                      {quantity} × {product.name}
                    </span>
                    <span className="tabular shrink-0 text-xs font-medium text-ink">
                      £{((product.price * quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-ink/10 px-5 pb-4 pt-3">
                <SummaryRow label="Subtotal" value={`£${(subtotal / 100).toFixed(2)}`} />
                <SummaryRow label="Delivery" value={`£${(deliveryFee / 100).toFixed(2)}`} />
                <div className="border-t border-ink/10 pt-2">
                  <SummaryRow label="Amount due" value={`£${(total / 100).toFixed(2)}`} bold />
                </div>
              </div>

              <div className="px-5 pb-5">
                <Button type="submit" fullWidth loading={isSubmitting}>
                  {isSubmitting ? 'Processing payment…' : `Pay £${(total / 100).toFixed(2)}`}
                </Button>
                <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-ink/40">
                  <ShieldCheck size={10} /> Mock payment page · Stripe test mode
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
    <div className={cn('flex justify-between', bold ? 'text-sm font-semibold text-ink' : 'text-xs text-ink/55')}>
      <span>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  )
}
