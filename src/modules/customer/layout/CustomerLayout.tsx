import { Outlet, useNavigate } from 'react-router-dom'
import { ChevronDown, MapPin, Search, ShoppingCart, User as UserIcon } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { useCartStore, cartItemCount, cartSubtotal } from '@shared/stores/cart.store'
import { Logo } from '@shared/components/Logo'

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-transparent text-[var(--ink)]">
      <CustomerHeader />
      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-6 md:py-10">
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
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[rgba(255,255,255,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-4 md:px-6">
        <button onClick={() => navigate('/customer/home')} className="shrink-0">
          <Logo size="sm" />
        </button>

        <button
          onClick={() => navigate('/customer/zone-check')}
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-900/5 transition-colors hover:border-slate-300 md:flex"
        >
          <MapPin size={14} className="text-brand-600" />
          <span>{deliveryArea ?? 'Select area'}</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>

        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search for food, stores, ingredients..."
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm shadow-slate-900/5 transition-all placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </div>

        <button
          onClick={() => navigate('/customer/cart')}
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items, £${(cartTotal / 100).toFixed(2)}` : ', empty'}`}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-slate-900/5 transition-all',
            cartCount > 0
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
          )}
        >
          <span className="relative">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold leading-none text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => navigate(user ? '/customer/home' : '/auth/phone')}
          className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-colors hover:border-slate-300 sm:flex"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <UserIcon size={15} />
          </span>
          <span>{user?.name ?? 'Sign in'}</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>
    </header>
  )
}
