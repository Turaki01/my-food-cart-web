import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Logo } from '@shared/components/Logo'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useAuthStore } from '@shared/stores/auth.store'
import { loginPartner } from '@shared/lib/api'
import { partnerLoginSchema, type PartnerLoginFormValues } from './auth.schema'

export function LoginPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const setUser = useAuthStore(s => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerLoginFormValues>({
    resolver: zodResolver(partnerLoginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (user?.role === 'store_partner') return <Navigate to="/store/orders" replace />

  const onSubmit = async ({ email, password }: PartnerLoginFormValues) => {
    const { user } = await loginPartner(email, password)
    setUser(user)
    navigate('/store/orders', { replace: true })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[--paper] px-5 py-10">
      <div className="paper-panel w-full max-w-sm rounded-xl p-8 shadow-sm">
        <Logo size="md" className="mb-7 justify-center" />

        <p className="section-kicker text-center text-[11px] font-semibold text-brand-600">Store partner</p>
        <h1 className="mt-2 text-center font-display text-2xl font-medium tracking-[-0.01em] text-ink">
          Sign in to your dashboard
        </h1>
        <p className="mt-2 mb-8 text-center text-sm leading-6 text-ink/55">
          Manage orders, your catalogue, and store settings.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="Enter email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
            Sign in
          </Button>
        </form>

       
      </div>

      <p className="mt-6 max-w-xs text-center text-xs text-ink/40">
        Want to list your store on My Food Cart?{' '}
        <a href="mailto:partners@myfoodcart.co.uk" className="underline-hover text-ink/60">
          Get in touch
        </a>
      </p>
    </div>
  )
}
