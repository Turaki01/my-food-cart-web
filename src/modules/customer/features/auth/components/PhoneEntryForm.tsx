import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@shared/components/Button'
import { PhoneInput } from '@shared/components/PhoneInput'
import { phoneSchema, type PhoneFormValues } from '../auth.schema'

interface PhoneEntryFormProps {
  onSubmit: (data: PhoneFormValues) => Promise<void>
}

export function PhoneEntryForm({ onSubmit }: PhoneEntryFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            onChange={field.onChange}
            error={errors.phone?.message}
          />
        )}
      />

      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Send code
      </Button>
    </form>
  )
}
