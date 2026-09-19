import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { profileDetailsSchema, type ProfileDetailsFormValues } from '../auth.schema'

interface ProfileDetailsFormProps {
  onSubmit: (data: ProfileDetailsFormValues) => Promise<void>
}

export function ProfileDetailsForm({ onSubmit }: ProfileDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: { name: '', email: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Your name"
        placeholder="Enter name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email address"
        hint="Optional"
        type="email"
        placeholder="Enter email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Continue
      </Button>
    </form>
  )
}
