import { Controller, type Control, type FieldErrors } from 'react-hook-form'
import { Badge } from '@shared/components/Badge'
import type { PaymentFormValues } from '../checkout.schema'

interface MockCardPaymentProps {
  control: Control<PaymentFormValues>
  errors: FieldErrors<PaymentFormValues>
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-white py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-ink/30 hover:bg-gray-50"
        >
          Apple Pay
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-white py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-ink/30 hover:bg-gray-50"
        >
          G Pay
        </button>
      </div>

      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/35">
        <span className="h-px flex-1 bg-ink/10" />
        Or pay with card
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <div className={errors.cardNumber || errors.cardExpiry || errors.cardCvc ? 'rounded-lg border border-red-400 bg-white' : 'rounded-lg border border-ink/15 bg-white focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20'}>
        <Controller
          name="cardNumber"
          control={control}
          render={({ field }) => {
            const digits = field.value?.replace(/\D/g, '') ?? ''
            const brand = detectBrand(digits)
            return (
              <FieldRow label="Card number">
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    maxLength={23}
                    value={field.value ?? ''}
                    onChange={e => field.onChange(formatCardNumber(e.target.value))}
                    onBlur={field.onBlur}
                    className="tabular flex-1 bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
                  />
                  {brand && (
                    <span className="shrink-0 rounded border border-ink/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/50">
                      {BRAND_LABEL[brand]}
                    </span>
                  )}
                </div>
              </FieldRow>
            )
          }}
        />

        <div className="grid grid-cols-2 border-t border-ink/15">
          <Controller
            name="cardExpiry"
            control={control}
            render={({ field }) => (
              <FieldRow label="Expiry" bordered>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(formatExpiry(e.target.value))}
                  onBlur={field.onBlur}
                  className="tabular w-full bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
                />
              </FieldRow>
            )}
          />
          <Controller
            name="cardCvc"
            control={control}
            render={({ field }) => (
              <FieldRow label="CVC">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  maxLength={4}
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={field.onBlur}
                  className="tabular w-full bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
                />
              </FieldRow>
            )}
          />
        </div>
      </div>
      {(errors.cardNumber || errors.cardExpiry || errors.cardCvc) && (
        <p className="text-xs text-red-600">
          {errors.cardNumber?.message ?? errors.cardExpiry?.message ?? errors.cardCvc?.message}
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-ink/40">
        You may be asked to verify this payment with your bank (3D Secure) before it completes.
      </p>

      <Badge variant="spice">Test mode — no real charge</Badge>

      <p className="text-[11px] leading-relaxed text-ink/40">
        Use <span className="font-medium text-ink/60">4242 4242 4242 4242</span> for a successful test
        payment, or <span className="font-medium text-ink/60">4000 0000 0000 0002</span> to simulate a
        decline.
      </p>
    </div>
  )
}

function FieldRow({
  label,
  bordered,
  children,
}: {
  label: string
  bordered?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={bordered ? 'border-r border-ink/15 px-4 py-3' : 'px-4 py-3'}>
      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-ink/40">{label}</p>
      <div className="flex items-center">{children}</div>
    </div>
  )
}
