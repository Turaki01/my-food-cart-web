import { z } from 'zod'

export const checkoutDetailsSchema = z.object({
  line1: z.string().min(3, 'Enter your street address'),
  line2: z.string().optional(),
  postcode: z
    .string()
    .min(5, 'Enter a valid UK postcode')
    .regex(/^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2}$/i, 'Enter a valid UK postcode'),
  deliverySlot: z.string().min(1, 'Choose a delivery time'),
  deliveryNote: z.string().optional(),
})

export const paymentSchema = z.object({
  cardNumber: z
    .string()
    .transform(v => v.replace(/\s/g, ''))
    .refine(v => /^\d{13,19}$/.test(v), 'Enter a valid card number'),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'MM/YY')
    .refine(v => {
      const [mm, yy] = v.split('/').map(Number)
      const now = new Date()
      const expiry = new Date(2000 + yy, mm)
      return expiry > now
    }, 'Card has expired'),
  cardCvc: z.string().regex(/^\d{3,4}$/, 'Enter CVC'),
})

export const checkoutSchema = checkoutDetailsSchema.merge(paymentSchema)

export type CheckoutDetailsFormValues = z.infer<typeof checkoutDetailsSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>
export type CheckoutFormValues = z.infer<typeof checkoutSchema>

// Recognized Stripe test-mode card numbers — this checkout is a front-end mock,
// no real charge is ever created.
export const TEST_CARD_DECLINE = '4000000000000002'

export interface DeliverySlot {
  id: string
  label: string
  sublabel: string
}

export function generateDeliverySlots(): DeliverySlot[] {
  const hour = new Date().getHours()

  const WINDOWS = [
    { start: 9,  end: 11, label: '9–11am'   },
    { start: 11, end: 13, label: '11am–1pm' },
    { start: 13, end: 15, label: '1–3pm'    },
    { start: 15, end: 17, label: '3–5pm'    },
    { start: 17, end: 19, label: '5–7pm'    },
    { start: 19, end: 21, label: '7–9pm'    },
  ]

  const slots: DeliverySlot[] = []

  // Today — only windows that haven't passed (need >1hr before end)
  WINDOWS.forEach(w => {
    if (hour < w.end - 1) {
      slots.push({ id: `today-${w.start}`, label: `Today, ${w.label}`, sublabel: 'Standard delivery' })
    }
  })

  // Always show tomorrow morning → evening
  WINDOWS.slice(0, 5).forEach(w => {
    slots.push({ id: `tmrw-${w.start}`, label: `Tomorrow, ${w.label}`, sublabel: 'Standard delivery' })
  })

  return slots
}
