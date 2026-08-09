import { z } from 'zod'

export const checkoutSchema = z.object({
  line1: z.string().min(3, 'Enter your street address'),
  line2: z.string().optional(),
  postcode: z
    .string()
    .min(5, 'Enter a valid UK postcode')
    .regex(/^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2}$/i, 'Enter a valid UK postcode'),
  deliverySlot: z.string().min(1, 'Choose a delivery time'),
  deliveryNote: z.string().optional(),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

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
