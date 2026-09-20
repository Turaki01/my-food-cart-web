import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { OrderStatusBadge } from '@shared/components/OrderStatusBadge'
import { cn, formatCurrency, formatDate } from '@shared/lib/utils'
import { useOrdersStore } from '@shared/stores/orders.store'
import type { OrderStatus } from '@shared/types'

const FILTERS: { label: string; status: OrderStatus | 'all' }[] = [
  { label: 'All', status: 'all' },
  { label: 'Confirmed', status: 'confirmed' },
  { label: 'Preparing', status: 'being_picked' },
  { label: 'Out for delivery', status: 'on_the_way' },
  { label: 'Delivered', status: 'delivered' },
]

export function AdminOrdersPage() {
  const orders = useOrdersStore(s => s.orders)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const visible = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Admin</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Orders</h1>
        <p className="mt-2 text-sm text-ink/55">
          {orders.length} orders across every store · read-only oversight, manage deliveries in ops dispatch
        </p>
      </div>

      <div className="mb-6 flex gap-6 overflow-x-auto border-b border-ink/10 pb-px scrollbar-none">
        {FILTERS.map(f => (
          <button
            key={f.status}
            onClick={() => setFilter(f.status)}
            className={cn(
              'shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors',
              filter === f.status ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink/45 hover:text-ink/70'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink/10 bg-white py-20 text-center shadow-sm">
          <Inbox size={28} className="mb-3 text-ink/25" />
          <p className="text-sm text-ink/50">No orders in this view</p>
        </div>
      ) : (
        <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-sm">
          {visible.map(order => (
            <div key={order.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="tabular text-sm font-semibold text-ink">{order.orderNumber}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-0.5 truncate text-xs text-ink/45">
                  {order.storeName} · {formatDate(order.createdAt)}
                </p>
              </div>
              <span className="tabular text-sm font-medium text-ink">{formatCurrency(order.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
