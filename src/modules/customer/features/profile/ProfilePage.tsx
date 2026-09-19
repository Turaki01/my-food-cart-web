import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LogOut, MapPin, Package } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { signOut as signOutRequest } from '@shared/lib/api'
import { formatDate, formatPhone } from '@shared/lib/utils'

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const authSignOut = useAuthStore(s => s.signOut)
  const { deliveryArea, postcode } = useLocationStore()
  // Suppresses the !user guard below while signing out — HomePage is lazy-loaded,
  // so this page can still be mounted for a moment after the user is cleared,
  // which would otherwise redirect to /auth/phone instead of /customer/home.
  const [signingOut, setSigningOut] = useState(false)

  if (!user && !signingOut) return <Navigate to="/auth/phone" state={{ from: '/customer/profile' }} replace />

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOutRequest()
    authSignOut()
    navigate('/customer/home', { replace: true })
  }

  if (!user) return null

  const initial = user.name ? user.name[0].toUpperCase() : user.phone.slice(-2)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Your account</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Profile &amp; settings</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-medium text-white">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-medium text-ink">{user.name ?? 'Welcome back'}</p>
            <p className="text-sm text-ink/55">{formatPhone(user.phone)}</p>
            <p className="mt-1 text-xs text-ink/40">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <p className="section-kicker mb-3 text-[11px] font-semibold text-ink/45">Delivery details</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="shrink-0 text-ink/40" />
              <div>
                <p className="text-sm text-ink">{deliveryArea ?? 'No delivery area set'}</p>
                {postcode && <p className="text-xs text-ink/45">{postcode}</p>}
              </div>
            </div>
            <button
              onClick={() => navigate('/customer/zone-check')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Change
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/customer/orders')}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white p-6 text-left shadow-sm transition-colors hover:bg-gray-50"
        >
          <div className="flex items-center gap-2.5">
            <Package size={15} className="shrink-0 text-ink/40" />
            <p className="text-sm font-medium text-ink">Order history</p>
          </div>
          <span className="text-xs text-ink/40">View all</span>
        </button>

        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <Button variant="secondary" fullWidth onClick={handleSignOut}>
            <LogOut size={14} className="mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
