import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@shared/components/Logo'
import { ProfileDetailsForm } from '../components/ProfileDetailsForm'
import { useAuthStore } from '@shared/stores/auth.store'
import type { ProfileDetailsFormValues } from '../auth.schema'

export function WelcomeDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const { user, setUser } = useAuthStore()

  if (!user) return <Navigate to="/auth/phone" state={{ from }} replace />

  const destination = from ?? '/customer/zone-check'

  const handleSubmit = async ({ name, email }: ProfileDetailsFormValues) => {
    setUser({ ...user, name, email: email || undefined })
    navigate(destination, { replace: true })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[--paper] px-5 py-10">
      <div className="paper-panel w-full max-w-sm rounded-xl p-8 shadow-sm">
        <Logo size="md" className="mb-7 justify-center" />

        <p className="section-kicker text-center text-[11px] font-semibold text-brand-600">Almost there</p>
        <h1 className="mt-2 text-center font-display text-2xl font-medium tracking-[-0.01em] text-ink">
          What should we call you?
        </h1>
        <p className="mt-2 mb-8 text-center text-sm leading-6 text-ink/55">
          So we can personalize your orders and say hi properly.
        </p>

        <ProfileDetailsForm onSubmit={handleSubmit} />

        <button
          onClick={() => navigate(destination, { replace: true })}
          className="mt-4 w-full text-center text-sm font-semibold text-ink/45 hover:text-ink/70"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
