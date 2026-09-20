import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { OrderStatusBadge } from '@shared/components/OrderStatusBadge'
import { cn, formatCurrency, formatDate } from '@shared/lib/utils'
import { usePartnerOrdersStore, nextOrderAction } from '@shared/stores/partnerOrders.store'
import type { OrderStatus } from '@shared/types'

const FILTERS: { label: string; status: OrderStatus | 'all' }[] = [
  { label: 'All', status: 'all' },
  { label: 'New', status: 'confirmed' },
  { label: 'Preparing', status: 'being_picked' },
  { label: 'Out for delivery', status: 'on_the_way' },
  { label: 'Delivered', status: 'delivered' },
]

export function OrdersDashboardPage() {
  const { orders, advanceStatus } = usePartnerOrdersStore()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const visible = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const newCount = orders.filter(o => o.status === 'confirmed').length

  return (
    <div>
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Store partner</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Orders</h1>
        <p className="mt-2 text-sm text-ink/55">
          {newCount > 0 ? `${newCount} new order${newCount !== 1 ? 's' : ''} waiting` : 'All caught up'}
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
            {f.status === 'confirmed' && newCount > 0 && (
              <span className="tabular ml-1.5 text-xs text-brand-600">({newCount})</span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink/10 bg-white py-20 text-center shadow-sm">
          <Inbox size={28} className="mb-3 text-ink/25" />
          <p className="text-sm text-ink/50">No orders in this view</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(order => {
            const action = nextOrderAction(order.status)
            const itemSummary = order.items.map(i => `${i.quantity}× ${i.product.name}`).join(', ')

            return (
              <div key={order.id} className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="tabular font-display text-base font-medium text-ink">{order.orderNumber}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-ink/45">{formatDate(order.createdAt)} · {order.deliverySlot}</p>
                  </div>
                  <span className="tabular font-display text-base font-medium text-ink">
                    {formatCurrency(order.total)}
                  </span>
                </div>

                <p className="mt-3 text-sm text-ink/70">{itemSummary}</p>
                <p className="mt-1 text-xs text-ink/45">
                  Deliver to {order.deliveryAddress.line1}, {order.deliveryAddress.postcode}
                </p>

                {action && (
                  <div className="mt-4 border-t border-ink/10 pt-4">
                    <Button size="sm" onClick={() => advanceStatus(order.id)}>
                      {action}
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
