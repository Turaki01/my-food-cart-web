import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Logo } from '@shared/components/Logo'
import { Badge } from '@shared/components/Badge'
import { cn } from '@shared/lib/utils'
import { useAuthStore } from '@shared/stores/auth.store'
import { signOut as signOutRequest } from '@shared/lib/api'

const NAV_ITEMS = [
  { to: '/admin/overview', label: 'Overview' },
  { to: '/admin/stores', label: 'Stores' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
]

export function AdminLayout() {
  const user = useAuthStore(s => s.user)

  if (user?.role !== 'admin') return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-[var(--paper)] text-ink">
      <AdminHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <Outlet />
      </main>
    </div>
  )
}

function AdminHeader() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const authSignOut = useAuthStore(s => s.signOut)

  const handleSignOut = async () => {
    await signOutRequest()
    navigate('/admin/login', { replace: true })
    authSignOut()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-4 md:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Logo size="sm" />
          <Badge variant="outline">Admin</Badge>
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
