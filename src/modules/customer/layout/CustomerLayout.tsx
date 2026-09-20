import { Outlet, useNavigate } from 'react-router-dom'
import { ChevronDown, MapPin, Package, Search, ShoppingCart, User } from 'lucide-react'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { useCartStore, cartItemCount, cartSubtotal } from '@shared/stores/cart.store'
import { Logo } from '@shared/components/Logo'

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-ink">
      <CustomerHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <Outlet />
      </main>
    </div>
  )
}

function CustomerHeader() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const deliveryArea = useLocationStore(s => s.deliveryArea)
  const { items, deliveryFee } = useCartStore()
  const cartCount = cartItemCount(items)
  const cartTotal = cartSubtotal(items) + (cartCount > 0 ? deliveryFee : 0)

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="hidden border-b border-ink/10 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50">
          <span>South London&rsquo;s African &amp; Caribbean market</span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/customer/zone-check')}
              className="flex items-center gap-1.5 text-ink/60 hover:text-ink"
            >
              <MapPin size={11} />
              {deliveryArea ?? 'Select delivery area'}
              <ChevronDown size={11} />
            </button>
            {user && (
              <button
                onClick={() => navigate('/customer/orders')}
                className="text-ink/60 hover:text-ink"
              >
                My orders
              </button>
            )}
            <button
              onClick={() => navigate(user ? '/customer/profile' : '/auth/phone')}
              className="text-ink/60 hover:text-ink"
            >
              {user ? (user.name ?? 'My account') : 'Sign in'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-4 md:gap-8 md:px-8 md:py-5">
          <button onClick={() => navigate('/customer/home')} className="shrink-0">
            <Logo size="sm" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              placeholder="Search for food, stores, ingredients…"
              className="w-full rounded-lg border border-ink/15 bg-gray-50 py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/35 transition-colors focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {user && (
              <button
                onClick={() => navigate('/customer/orders')}
                aria-label="Order history"
                className="hidden items-center gap-2 rounded-lg px-3 py-2 text-ink transition-colors hover:bg-gray-100 md:flex"
              >
                <Package size={17} strokeWidth={1.75} />
              </button>
            )}
            <button
              onClick={() => navigate(user ? '/customer/profile' : '/auth/phone')}
              aria-label={user ? 'Profile & settings' : 'Sign in'}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-ink transition-colors hover:bg-gray-100"
            >
              <User size={17} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => navigate('/customer/cart')}
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items, £${(cartTotal / 100).toFixed(2)}` : ', empty'}`}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-ink transition-colors hover:bg-gray-100"
            >
              <ShoppingCart size={17} strokeWidth={1.75} />
              <span className="hidden text-sm font-semibold sm:inline">Cart</span>
              {cartCount > 0 && <span className="tabular text-sm font-semibold">({cartCount})</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
