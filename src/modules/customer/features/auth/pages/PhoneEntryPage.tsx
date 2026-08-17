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

  const isCheckoutReturn = from === '/customer/checkout'

  const handleSubmit = async ({ phone }: PhoneFormValues) => {
    await sendOTP(phone)
    setPendingPhone(phone)
    navigate('/auth/otp', { state: { from } })
  }

  return (
    <AuthShell>
      <Logo size="md" className="justify-center mb-7" />
      <h1 className="font-display text-xl font-semibold text-gray-900 text-center mb-1">
        {isCheckoutReturn ? 'Verify to place your order' : 'Welcome'}
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
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
    <div className="min-h-[100dvh] bg-surface flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
        {children}
      </div>
      <p className="mt-6 text-xs text-gray-400 text-center max-w-xs">
        By continuing you agree to our{' '}
        <a href="/privacy" className="underline">Privacy Policy</a>
        {' '}and{' '}
        <a href="/terms" className="underline">Terms of Service</a>.
      </p>
    </div>
  )
}
