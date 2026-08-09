import { z } from 'zod'

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .regex(/^\+[1-9]\d{6,14}$/, 'Enter a valid phone number'),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Enter the 6-digit code')
    .regex(/^\d{6}$/, 'Code must be 6 digits'),
})

export type PhoneFormValues = z.infer<typeof phoneSchema>
export type OTPFormValues = z.infer<typeof otpSchema>
