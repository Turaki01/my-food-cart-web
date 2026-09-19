import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Clock3, MapPin } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Badge } from '@shared/components/Badge'
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
        className="underline-hover mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/55 transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} />
        Back to {storeName}
      </Link>

      <div className="mb-6 flex items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="section-kicker text-[11px] font-semibold text-ink/45">Checkout · Step 1 of 2</p>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Delivery details</h1>
          <p className="mt-2 text-sm text-ink/55">
            Add your address and choose a time slot before you move to payment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <FormSection title="Delivery address">
              <div className="space-y-3">
                <Input
                  label="Street address"
                  placeholder="Enter street address"
                  error={errors.line1?.message}
                  {...register('line1')}
                />
                <Input
                  label="Flat / floor (optional)"
                  placeholder="Enter flat or floor"
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
                placeholder="Enter delivery instructions"
                {...register('deliveryNote')}
                className="w-full resize-none rounded-lg border border-ink/15 bg-white px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              />
            </FormSection>
          </div>

          <div className="sticky top-24">
            <div className="rounded-xl border border-ink/10 bg-white shadow-sm">
              <div className="border-b border-ink/10 px-5 py-4">
                <p className="section-kicker text-[11px] font-semibold text-ink/45">Order summary</p>
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
                  <SummaryRow label="Total" value={`£${(total / 100).toFixed(2)}`} bold />
                </div>
              </div>

              <div className="px-5 pb-5">
                <Button type="submit" fullWidth>
                  Continue to payment <ArrowRight size={14} className="ml-1.5" />
                </Button>
                <p className="mt-2 text-center text-[11px] text-ink/40">
                  Payment comes next on a separate secure checkout step
                </p>
              </div>
            </div>

            {store && (
              <div className="mt-3 rounded-xl border border-ink/10 bg-white px-4 py-3 text-[11px] text-ink/55 shadow-sm">
                <p className="flex items-center gap-2">
                  <MapPin size={12} className="text-ink/40" />
                  {deliveryArea ? `Delivering to ${deliveryArea}` : 'Delivery area confirmed'}
                </p>
                <p className="mt-2 flex items-center gap-2">
                  <Clock3 size={12} className="text-ink/40" />
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
    <div className="rounded-xl border border-ink/10 bg-white px-6 py-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
        {optional && <Badge variant="gray">Optional</Badge>}
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
        'rounded-lg border px-3.5 py-3 text-left transition-colors duration-150',
        selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink/15 hover:border-brand-300 hover:bg-brand-50/40'
      )}
    >
      <p className="text-xs font-semibold leading-snug">{slot.label}</p>
      <p className={cn('mt-0.5 text-[10px]', selected ? 'text-white/70' : 'text-ink/40')}>{slot.sublabel}</p>
    </button>
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
