import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { Input } from '@shared/components/Input'
import { useCartStore, cartSubtotal } from '@shared/stores/cart.store'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { MOCK_STORES } from '@modules/customer/features/home/mock'
import { MockCardPayment } from './components/MockCardPayment'
import {
  checkoutSchema,
  generateDeliverySlots,
  TEST_CARD_DECLINE,
  type CheckoutFormValues,
  type DeliverySlot,
} from './checkout.schema'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, storeId, storeName, deliveryFee, clearCart } = useCartStore()
  const user = useAuthStore(s => s.user)
  const deliveryArea = useLocationStore(s => s.deliveryArea)

  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)

  const store = MOCK_STORES.find(s => s.id === storeId)
  const slots = generateDeliverySlots()
  const subtotal = cartSubtotal(items)
  const total = subtotal + deliveryFee

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      line1: '',
      line2: '',
      postcode: '',
      deliverySlot: slots[0]?.id ?? '',
      deliveryNote: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  })

  const selectedSlot = watch('deliverySlot')

  // Skip the empty-basket redirect once an order is placing — clearCart() fires
  // before the (lazy-loaded) confirmation route finishes mounting, and this
  // page stays mounted in the gap.
  if (items.length === 0 && !isPlacing) return <Navigate to="/customer/cart" replace />
  if (!user) return <Navigate to="/auth/phone" state={{ from: '/customer/checkout' }} replace />

  const onSubmit = async (data: CheckoutFormValues) => {
    setPaymentError(null)
    setIsPlacing(true)

    // Mock Stripe: no real PaymentIntent is created. Card number decides the outcome,
    // mirroring Stripe's own test-card conventions.
    await new Promise(r => setTimeout(r, 1400))

    if (data.cardNumber.replace(/\s/g, '') === TEST_CARD_DECLINE) {
      setPaymentError('Your card was declined. Try a different card.')
      setIsPlacing(false)
      return
    }

    const slot = slots.find(s => s.id === data.deliverySlot)
    const orderNumber = `MFC-${Date.now().toString(36).toUpperCase().slice(-6)}`

    navigate('/customer/order-confirmation', {
      replace: true,
      state: {
        orderNumber,
        storeName,
        storeId,
        items: [...items],
        address: { line1: data.line1, line2: data.line2, postcode: data.postcode.toUpperCase() },
        deliverySlot: slot?.label ?? data.deliverySlot,
        deliveryNote: data.deliveryNote,
        subtotal,
        deliveryFee,
        total,
        phone: user?.phone,
      },
    })
    clearCart()
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        to={storeId ? `/customer/store/${storeId}` : '/customer/cart'}
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Back to {storeName}
      </Link>

      <h1 className="text-lg font-semibold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

          {/* ── Left: form sections ───────────────────────────────────── */}
          <div className="space-y-4">

            {/* Delivery address */}
            <FormSection title="Delivery address">
              <div className="space-y-3">
                <Input
                  label="Street address"
                  placeholder="12 Rye Lane"
                  error={errors.line1?.message}
                  {...register('line1')}
                />
                <Input
                  label="Flat / floor (optional)"
                  placeholder="Flat 3"
                  {...register('line2')}
                />
                <Input
                  label="Postcode"
                  placeholder="SE15 4RH"
                  className="uppercase"
                  error={errors.postcode?.message}
                  {...register('postcode')}
                />
              </div>
            </FormSection>

            {/* Delivery time */}
            <FormSection
              title="Delivery time"
              error={errors.deliverySlot?.message}
            >
              {slots.length === 0 ? (
                <p className="text-sm text-gray-500">No slots available today. Check back tomorrow.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {slots.map(slot => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      selected={selectedSlot === slot.id}
                      onClick={() => setValue('deliverySlot', slot.id, { shouldValidate: true })}
                    />
                  ))}
                </div>
              )}
            </FormSection>

            {/* Delivery note */}
            <FormSection title="Delivery note" optional>
              <textarea
                rows={2}
                placeholder="e.g. Leave at door, ring bell twice…"
                {...register('deliveryNote')}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-300 transition-all"
              />
            </FormSection>

            {/* Payment */}
            <FormSection title="Payment">
              <MockCardPayment control={control} errors={errors} />
            </FormSection>

          </div>

          {/* ── Right: order summary ──────────────────────────────────── */}
          <div className="sticky top-20">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Order summary</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {items.length} item{items.length !== 1 ? 's' : ''} · {storeName}
                </p>
              </div>

              {/* Items */}
              <div className="px-5 py-3 space-y-2 max-h-52 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-600 leading-snug truncate">
                      {quantity} × {product.name}
                    </span>
                    <span className="text-xs font-medium text-gray-900 shrink-0 tabular-nums">
                      £{((product.price * quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 pb-4 border-t border-gray-50 pt-3 space-y-2">
                <SummaryRow label="Subtotal" value={`£${(subtotal / 100).toFixed(2)}`} />
                <SummaryRow label="Delivery" value={`£${(deliveryFee / 100).toFixed(2)}`} />
                <div className="pt-2 border-t border-gray-100">
                  <SummaryRow
                    label="Total"
                    value={`£${(total / 100).toFixed(2)}`}
                    bold
                  />
                </div>
              </div>

              {/* Error */}
              {paymentError && (
                <div className="mx-4 mb-3 flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 leading-snug">{paymentError}</p>
                </div>
              )}

              {/* CTA */}
              <div className="px-4 pb-4">
                <button
                  type="submit"
                  disabled={isPlacing}
                  className={cn(
                    'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
                    isPlacing
                      ? 'bg-brand-400 text-white cursor-wait'
                      : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.99]'
                  )}
                >
                  {isPlacing ? 'Placing order…' : `Place order · £${(total / 100).toFixed(2)}`}
                </button>
                <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400 mt-2">
                  <ShieldCheck size={10} /> Mock checkout — Stripe test mode
                </p>
              </div>
            </div>

            {/* Delivery info reminder */}
            {store && (
              <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                {deliveryArea && <>Delivering to {deliveryArea} · </>}
                Est. {store.estimatedDeliveryMin}–{store.estimatedDeliveryMax} min after cutoff
              </p>
            )}
          </div>

        </div>
      </form>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormSection({
  title,
  optional,
  error,
  children,
}: {
  title: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {optional && (
          <span className="text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
            Optional
          </span>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}

function SlotCard({
  slot,
  selected,
  onClick,
}: {
  slot: DeliverySlot
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-2xl border px-3.5 py-3 text-left transition-all duration-150',
        selected
          ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
          : 'border-gray-200 bg-white hover:border-brand-300'
      )}
    >
      <p className={cn('text-xs font-semibold leading-snug', selected ? 'text-brand-700' : 'text-gray-900')}>
        {slot.label}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5">{slot.sublabel}</p>
    </button>
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
