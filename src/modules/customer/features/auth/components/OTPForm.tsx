import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@shared/components/Button'
import { OTPInput } from '@shared/components/OTPInput'
import { otpSchema, type OTPFormValues } from '../auth.schema'

interface OTPFormProps {
  phone: string
  onSubmit: (data: OTPFormValues) => Promise<void>
  onResend: () => Promise<void>
}

export function OTPForm({ phone, onSubmit, onResend }: OTPFormProps) {
  const [resendCountdown, setResendCountdown] = useState(0)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  const handleResend = async () => {
    await onResend()
    setResendCountdown(30)
    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <p className="text-sm text-gray-500 text-center">
        We sent a 6-digit code to <span className="font-medium text-gray-900">{phone}</span>
      </p>

      <div className="flex flex-col items-center gap-3">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              error={!!errors.otp}
            />
          )}
        />
        {errors.otp && (
          <p className="text-sm text-red-600">{errors.otp.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Verify
      </Button>

      <div className="text-center">
        {resendCountdown > 0 ? (
          <p className="text-sm text-gray-400">Resend code in {resendCountdown}s</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-brand-600 hover:underline"
          >
            Resend code
          </button>
        )}
      </div>
    </form>
  )
}
