import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@shared/components/Logo'
import { OTPForm } from '../components/OTPForm'
import { useAuthStore } from '@shared/stores/auth.store'
import { sendOTP, verifyOTP } from '@shared/lib/api'
import { formatPhone } from '@shared/lib/utils'
import type { OTPFormValues } from '../auth.schema'

export function OTPPage() {
  const navigate = useNavigate()
  const { pendingPhone, setPendingPhone, setUser } = useAuthStore()

  // Guard: if no pending phone, send back
  useEffect(() => {
    if (!pendingPhone) navigate('/auth/phone', { replace: true })
  }, [pendingPhone, navigate])

  if (!pendingPhone) return null

  const handleSubmit = async ({ otp }: OTPFormValues) => {
    const { user, isNewUser } = await verifyOTP(pendingPhone, otp)
    setUser(user)
    navigate(isNewUser ? '/customer/zone-check' : '/customer/home', { replace: true })
  }

  const handleResend = async () => {
    await sendOTP(pendingPhone)
  }

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
        <button
          onClick={() => { setPendingPhone(''); navigate('/auth/phone') }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <Logo size="md" className="justify-center mb-6" />

        <h1 className="text-lg font-semibold text-gray-900 text-center mb-1">Check your phone</h1>
        <OTPForm
          phone={formatPhone(pendingPhone)}
          onSubmit={handleSubmit}
          onResend={handleResend}
        />
      </div>
    </div>
  )
}
