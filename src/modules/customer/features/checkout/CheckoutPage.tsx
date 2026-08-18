import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Clock3, MapPin } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { Input } from '@shared/components/Input'
import { useCartStore, cartSubtotal } from '@shared/stores/cart.store'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { useCheckoutStore } from '@shared/stores/checkout.store'
import { MOCK_STORES } from '@modules/customer/features/home/mock'
import {
  checkoutDetailsSchema,
  generateDeliverySlots,
  type CheckoutDetailsFormValues,
  type DeliverySlot,
} from './checkout.schema'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, storeId, storeName, deliveryFee } = useCartStore()
  const user = useAuthStore(s => s.user)
  const deliveryArea = useLocationStore(s => s.deliveryArea)
  const { draft, setDraft } = useCheckoutStore()

  const store = MOCK_STORES.find(s => s.id === storeId)
  const slots = generateDeliverySlots()
  const subtotal = cartSubtotal(items)
  const total = subtotal + deliveryFee

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutDetailsFormValues>({
    resolver: zodResolver(checkoutDetailsSchema),
    defaultValues: {
      line1: draft?.line1 ?? '',
      line2: draft?.line2 ?? '',
      postcode: draft?.postcode ?? '',
      deliverySlot: draft?.deliverySlot ?? slots[0]?.id ?? '',
      deliveryNote: draft?.deliveryNote ?? '',
    },
  })

  const selectedSlot = watch('deliverySlot')

  if (items.length === 0) return <Navigate to="/customer/cart" replace />
  if (!user) return <Navigate to="/auth/phone" state={{ from: '/customer/checkout' }} replace />

  const onSubmit = (data: CheckoutDetailsFormValues) => {
    setDraft({
      ...data,
      postcode: data.postcode.toUpperCase(),
    })
    navigate('/customer/payment')
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to={storeId ? `/customer/store/${storeId}` : '/customer/cart'}
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft size={13} />
        Back to {storeName}
      </Link>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker text-[11px] font-bold text-brand-600">Checkout</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900">Delivery details</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add your address and choose a time slot before you move to payment.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 sm:flex">
          Step 1 of 2
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
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

            <FormSection title="Delivery time" error={errors.deliverySlot?.message}>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-500">No slots available today. Check back tomorrow.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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

            <FormSection title="Delivery note" optional>
              <textarea
                rows={2}
                placeholder="e.g. Leave at door, ring bell twice..."
                {...register('deliveryNote')}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </FormSection>
          </div>

          <div className="sticky top-20">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
              <div className="border-b border-gray-50 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Order summary</h3>
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
                  <SummaryRow label="Total" value={`£${(total / 100).toFixed(2)}`} bold />
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Continue to payment <ArrowRight size={14} />
                </button>
                <p className="mt-2 text-center text-[11px] text-gray-400">
                  Payment comes next on a separate secure checkout step
                </p>
              </div>
            </div>

            {store && (
              <div className="mt-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-[11px] text-gray-500">
                <p className="flex items-center gap-2">
                  <MapPin size={12} className="text-gray-400" />
                  {deliveryArea ? `Delivering to ${deliveryArea}` : 'Delivery area confirmed'}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <Clock3 size={12} className="text-gray-400" />
                  Est. {store.estimatedDeliveryMin}-{store.estimatedDeliveryMax} min after cutoff
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

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
    <div className="rounded-3xl border border-gray-100 bg-white px-5 py-5">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {optional && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400">
            Optional
          </span>
        )}
      </div>
      {children}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
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
      <p className="mt-0.5 text-[10px] text-gray-400">{slot.sublabel}</p>
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
