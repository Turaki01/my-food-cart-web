import { z } from 'zod'

export const postcodeSchema = z.object({
  postcode: z
    .string()
    .min(5, 'Enter a valid UK postcode')
    .regex(/^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2}$/, 'Enter a valid UK postcode'),
})

export const waitlistSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
})

export type PostcodeFormValues = z.infer<typeof postcodeSchema>
export type WaitlistFormValues = z.infer<typeof waitlistSchema>
