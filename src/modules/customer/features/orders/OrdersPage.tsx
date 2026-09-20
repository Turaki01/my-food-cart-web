import { Link, Navigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { useAuthStore } from '@shared/stores/auth.store'
import { useOrdersStore } from '@shared/stores/orders.store'
import { cn, formatCurrency, formatDate } from '@shared/lib/utils'
import { MOCK_STORES } from '@modules/customer/features/home/mock'
import { OrderStatusBadge } from '@shared/components/OrderStatusBadge'
import { useReorder } from './useReorder'

export function OrdersPage() {
  const user = useAuthStore(s => s.user)
  const orders = useOrdersStore(s => s.orders)
  const reorder = useReorder()

  if (!user) return <Navigate to="/auth/phone" state={{ from: '/customer/orders' }} replace />

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Package size={28} className="mb-4 text-ink/25" />
        <h2 className="mb-1 font-display text-xl font-medium text-ink">No orders yet</h2>
        <p className="mb-6 max-w-xs text-sm text-ink/50">
          Your past orders will show up here once you place one.
        </p>
        <Link
          to="/customer/home"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          Browse stores
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Your account</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Order history</h1>
        <p className="mt-2 text-sm text-ink/55">
          {orders.length} order{orders.length !== 1 ? 's' : ''} · reorder in one tap
        </p>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const store = MOCK_STORES.find(s => s.id === order.storeId)
          const itemSummary =
            order.items.length <= 2
              ? order.items.map(i => i.product.name).join(', ')
              : `${order.items[0].product.name}, ${order.items[1].product.name} +${order.items.length - 2} more`
          const canReorder = order.items.some(i => i.product.inStock)

          return (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-xl border border-ink/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <Link to={`/customer/orders/${order.orderNumber}`} className="flex min-w-0 flex-1 items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                    store?.coverGradient ?? 'from-gray-400 to-gray-600'
                  )}
                >
                  <span className="font-display text-lg font-medium text-white/90">
                    {order.storeName.trim()[0]?.toUpperCase()}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-ink">{order.storeName}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-xs text-ink/45">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="mt-1 truncate text-xs text-ink/55">{itemSummary}</p>
                </div>
              </Link>

              <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                <span className="tabular font-display text-base font-medium text-ink">
                  {formatCurrency(order.total)}
                </span>
                <Button size="sm" variant="secondary" disabled={!canReorder} onClick={() => reorder(order)}>
                  Reorder
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
