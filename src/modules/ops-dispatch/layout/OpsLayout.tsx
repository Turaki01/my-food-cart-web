import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Logo } from '@shared/components/Logo'
import { Badge } from '@shared/components/Badge'
import { useAuthStore } from '@shared/stores/auth.store'
import { signOut as signOutRequest } from '@shared/lib/api'

export function OpsLayout() {
  const user = useAuthStore(s => s.user)

  if (user?.role !== 'ops') return <Navigate to="/ops/login" replace />

  return (
    <div className="min-h-screen bg-[var(--paper)] text-ink">
      <OpsHeader />
      <main className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <Outlet />
      </main>
    </div>
  )
}

function OpsHeader() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const authSignOut = useAuthStore(s => s.signOut)

  const handleSignOut = async () => {
    await signOutRequest()
    navigate('/ops/login', { replace: true })
    authSignOut()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-8 px-5 py-4 md:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <Logo size="sm" />
          <Badge variant="spice">Ops</Badge>
        </div>

        <div className="flex-1" />

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
