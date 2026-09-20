import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@shared/components/Logo'
import { OTPForm } from '../components/OTPForm'
import { useAuthStore } from '@shared/stores/auth.store'
import { sendOTP, verifyOTP } from '@shared/lib/api'
import { formatPhone } from '@shared/lib/utils'
import type { OTPFormValues } from '../auth.schema'

export function OTPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const { pendingPhone, setPendingPhone, setUser } = useAuthStore()

  // Guard: if no pending phone, send back
  useEffect(() => {
    if (!pendingPhone) navigate('/auth/phone', { replace: true, state: { from } })
  }, [pendingPhone, navigate, from])

  if (!pendingPhone) return null

  const handleSubmit = async ({ otp }: OTPFormValues) => {
    const { user, isNewUser } = await verifyOTP(pendingPhone, otp)
    setUser(user)
    navigate(isNewUser ? '/auth/welcome' : (from ?? '/customer/home'), { replace: true, state: { from } })
  }

  const handleResend = async () => {
    await sendOTP(pendingPhone)
  }

  return (
    <div className="min-h-[100dvh] bg-[--paper] flex flex-col items-center justify-center px-5 py-10">
      <div className="paper-panel w-full max-w-sm rounded-xl p-8 shadow-sm">
        <button
          onClick={() => { setPendingPhone(''); navigate('/auth/phone', { state: { from } }) }}
          className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-ink/55 hover:text-ink"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <Logo size="md" className="justify-center mb-6" />

        <h1 className="mb-1 text-center font-display text-2xl font-medium tracking-[-0.01em] text-ink">Check your phone</h1>
        <OTPForm
          phone={formatPhone(pendingPhone)}
          onSubmit={handleSubmit}
          onResend={handleResend}
        />
      </div>
    </div>
  )
}
