import { z } from 'zod'

export const newProductSchema = z.object({
  name: z.string().min(2, 'Enter a product name'),
  category: z.string().min(2, 'Choose or enter a category'),
  unit: z.string().min(1, 'Enter a unit, e.g. 1kg'),
  price: z.coerce.number().positive('Enter a price above £0'),
  quantity: z.coerce.number().int('Enter a whole number').nonnegative('Enter a quantity of 0 or more'),
})

export type NewProductFormValues = z.infer<typeof newProductSchema>
