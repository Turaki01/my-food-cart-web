import { z } from 'zod'

export const storeSettingsSchema = z.object({
  minimumOrderValue: z.coerce.number().min(0, 'Enter a minimum order value'),
  estimatedDeliveryMin: z.coerce.number().positive('Enter a delivery estimate'),
  estimatedDeliveryMax: z.coerce.number().positive('Enter a delivery estimate'),
}).refine(v => v.estimatedDeliveryMax >= v.estimatedDeliveryMin, {
  message: 'Max must be greater than or equal to min',
  path: ['estimatedDeliveryMax'],
})

export type StoreSettingsFormValues = z.infer<typeof storeSettingsSchema>
