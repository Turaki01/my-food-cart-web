import { z } from 'zod'

export const opsLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type OpsLoginFormValues = z.infer<typeof opsLoginSchema>
