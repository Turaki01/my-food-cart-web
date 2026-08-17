import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { ShieldCheck } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import type { CheckoutFormValues } from '../checkout.schema'

interface MockCardPaymentProps {
  control: Control<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
}

type CardBrand = 'visa' | 'mastercard' | 'amex' | null

function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits)) return 'amex'
  return null
}

const BRAND_LABEL: Record<Exclude<CardBrand, null>, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 19)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function MockCardPayment({ control, errors }: MockCardPaymentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 rounded-full bg-spice-50 text-spice-700 border border-spice-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide w-fit">
        <ShieldCheck size={11} />
        Test mode — no real charge
      </div>

      <Controller
        name="cardNumber"
        control={control}
        render={({ field }) => {
          const digits = field.value?.replace(/\D/g, '') ?? ''
          const brand = detectBrand(digits)
          return (
            <FieldShell label="Card number" error={errors.cardNumber?.message}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  maxLength={23}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(formatCardNumber(e.target.value))}
                  onBlur={field.onBlur}
                  className="flex-1 text-sm text-gray-900 bg-transparent placeholder:text-gray-300 focus:outline-none tabular-nums"
                />
                {brand && (
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                    {BRAND_LABEL[brand]}
                  </span>
                )}
              </div>
            </FieldShell>
          )
        }}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <Controller
          name="cardExpiry"
          control={control}
          render={({ field }) => (
            <FieldShell label="Expiry" error={errors.cardExpiry?.message}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                maxLength={5}
                value={field.value ?? ''}
                onChange={e => field.onChange(formatExpiry(e.target.value))}
                onBlur={field.onBlur}
                className="w-full text-sm text-gray-900 bg-transparent placeholder:text-gray-300 focus:outline-none tabular-nums"
              />
            </FieldShell>
          )}
        />
        <Controller
          name="cardCvc"
          control={control}
          render={({ field }) => (
            <FieldShell label="CVC" error={errors.cardCvc?.message}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onBlur={field.onBlur}
                className="w-full text-sm text-gray-900 bg-transparent placeholder:text-gray-300 focus:outline-none tabular-nums"
              />
            </FieldShell>
          )}
        />
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">
        Use <span className="font-mono text-gray-500">4242 4242 4242 4242</span> for a successful test
        payment, or <span className="font-mono text-gray-500">4000 0000 0000 0002</span> to simulate a
        decline.
      </p>
    </div>
  )
}

function FieldShell({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        className={cn(
          'rounded-2xl border px-4 py-3 transition-colors',
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus-within:border-brand-300 focus-within:bg-white'
        )}
      >
        <p className="text-[10px] text-gray-400 mb-1.5 font-medium tracking-wide uppercase">{label}</p>
        {children}
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}
