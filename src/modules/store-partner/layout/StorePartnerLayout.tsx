import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Logo } from '@shared/components/Logo'
import { Badge } from '@shared/components/Badge'
import { cn } from '@shared/lib/utils'
import { useAuthStore } from '@shared/stores/auth.store'
import { signOut as signOutRequest } from '@shared/lib/api'

const NAV_ITEMS = [
  { to: '/store/orders', label: 'Orders' },
  { to: '/store/catalog', label: 'Catalogue' },
  { to: '/store/settings', label: 'Settings' },
]

export function StorePartnerLayout() {
  const user = useAuthStore(s => s.user)

  if (user?.role !== 'store_partner') return <Navigate to="/store/login" replace />

  return (
    <div className="min-h-screen bg-[var(--paper)] text-ink">
      <StorePartnerHeader />
      <main className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <Outlet />
      </main>
    </div>
  )
}

function StorePartnerHeader() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const authSignOut = useAuthStore(s => s.signOut)

  const handleSignOut = async () => {
    await signOutRequest()
    navigate('/store/login', { replace: true })
    authSignOut()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-8 px-5 py-4 md:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Logo size="sm" />
          <Badge variant="green">Partner</Badge>
        </div>

        <nav className="flex flex-1 items-center gap-6">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'border-b-2 py-1 text-sm font-semibold transition-colors',
                  isActive ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink/55 hover:text-ink'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-sm text-ink/55 sm:inline">{user?.name}</span>
          <button
            onClick={handleSignOut}
            aria-label="Sign out"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink/60 transition-colors hover:bg-gray-100 hover:text-ink"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
