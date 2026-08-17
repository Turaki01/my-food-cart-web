import { Outlet, useNavigate } from 'react-router-dom'
import { ChevronDown, Search, ShoppingCart, User as UserIcon } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useAuthStore } from '@shared/stores/auth.store'
import { useLocationStore } from '@shared/stores/location.store'
import { useCartStore, cartSubtotal, cartItemCount } from '@shared/stores/cart.store'
import { Logo } from '@shared/components/Logo'

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <CustomerHeader />
      <main className="max-w-6xl mx-auto w-full px-6 py-8">
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <button onClick={() => navigate('/customer/home')} className="shrink-0">
          <Logo size="sm" />
        </button>

        {/* Location picker */}
        <button
          onClick={() => navigate('/customer/zone-check')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-colors shrink-0"
        >
          <span className="h-2 w-2 rounded-full bg-brand-600" />
          <span className="font-medium">{deliveryArea ?? 'Select area'}</span>
          <ChevronDown size={13} className="text-gray-400" />
        </button>

        {/* Search */}
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search stores & products"
            className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-300 transition-all bg-gray-50"
          />
        </div>

        {/* Auth */}
        {!user && (
          <button
            onClick={() => navigate('/auth/phone')}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 shrink-0"
          >
            <UserIcon size={15} />
            Sign in
          </button>
        )}

        {/* Cart */}
        <button
          onClick={() => navigate('/customer/cart')}
          aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items, £${(cartTotal / 100).toFixed(2)}` : ', empty'}`}
          className={cn(
            'flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm font-medium shrink-0 transition-all',
            cartCount > 0
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          )}
        >
          <div className="relative">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-white text-brand-600 text-[10px] font-bold flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          {cartCount > 0
            ? <span>£{(cartTotal / 100).toFixed(2)}</span>
            : <span>Cart</span>
          }
        </button>

      </div>
    </header>
  )
}
