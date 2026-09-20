import { z } from 'zod'

export const newStoreSchema = z.object({
  name: z.string().min(2, 'Enter a store name'),
  area: z.string().min(2, 'Enter an area, e.g. Peckham'),
  categoryTags: z.string().min(2, 'Enter at least one category'),
  minimumOrderValue: z.coerce.number().min(0, 'Enter a minimum order value'),
  estimatedDeliveryMin: z.coerce.number().positive('Enter a delivery estimate'),
  estimatedDeliveryMax: z.coerce.number().positive('Enter a delivery estimate'),
}).refine(v => v.estimatedDeliveryMax >= v.estimatedDeliveryMin, {
  message: 'Max must be greater than or equal to min',
  path: ['estimatedDeliveryMax'],
})

export type NewStoreFormValues = z.infer<typeof newStoreSchema>
