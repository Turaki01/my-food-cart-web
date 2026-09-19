import { useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@shared/components/Logo'
import { PhoneEntryForm } from '../components/PhoneEntryForm'
import { useAuthStore } from '@shared/stores/auth.store'
import { sendOTP } from '@shared/lib/api'
import type { PhoneFormValues } from '../auth.schema'

export function PhoneEntryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const setPendingPhone = useAuthStore(s => s.setPendingPhone)

  const isCheckoutReturn = from === '/customer/checkout' || from === '/customer/payment'

  const handleSubmit = async ({ phone }: PhoneFormValues) => {
    await sendOTP(phone)
    setPendingPhone(phone)
    navigate('/auth/otp', { state: { from } })
  }

  return (
    <AuthShell>
      <Logo size="md" className="justify-center mb-7" />
      <p className="section-kicker text-center text-[11px] font-semibold text-ink/45">
        {isCheckoutReturn ? 'One step from checkout' : 'London diaspora grocery delivery'}
      </p>
      <h1 className="mt-2 text-center font-display text-2xl font-medium tracking-[-0.01em] text-ink">
        {isCheckoutReturn ? 'Verify to place your order' : 'Welcome'}
      </h1>
      <p className="mt-2 mb-8 text-center text-sm leading-6 text-ink/55">
        {isCheckoutReturn
          ? "Your basket is saved — we just need your number to confirm it's you"
          : 'Enter your phone number to get started'}
      </p>
      <PhoneEntryForm onSubmit={handleSubmit} />
    </AuthShell>
  )
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[--paper] flex flex-col items-center justify-center px-5 py-10">
      <div className="paper-panel w-full max-w-sm rounded-xl p-8 shadow-sm">
        {children}
      </div>
      <p className="mt-6 max-w-xs text-center text-xs text-ink/40">
        By continuing you agree to our{' '}
        <a href="/privacy" className="underline-hover text-ink/60">Privacy Policy</a>
        {' '}and{' '}
        <a href="/terms" className="underline-hover text-ink/60">Terms of Service</a>.
      </p>
    </div>
  )
}
