import { useState } from 'react'
import { Inbox, Truck } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { OrderStatusBadge } from '@shared/components/OrderStatusBadge'
import { cn, formatCurrency, formatDate } from '@shared/lib/utils'
import { MOCK_STORES } from '@modules/customer/features/home/mock'
import type { Order, OrderStatus } from '@shared/types'
import { useOpsOrders } from './useOpsOrders'

const FILTERS: { label: string; status: OrderStatus | 'all' }[] = [
  { label: 'All', status: 'all' },
  { label: 'Confirmed', status: 'confirmed' },
  { label: 'Preparing', status: 'being_picked' },
  { label: 'Out for delivery', status: 'on_the_way' },
  { label: 'Delivered', status: 'delivered' },
]

export function DispatchBoardPage() {
  const { orders, markDelivered } = useOpsOrders()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('on_the_way')

  const visible = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const readyCount = orders.filter(o => o.status === 'on_the_way').length

  return (
    <div>
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Ops dispatch</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Deliveries</h1>
        <p className="mt-2 text-sm text-ink/55">
          {readyCount > 0 ? `${readyCount} order${readyCount !== 1 ? 's' : ''} out for delivery` : 'Nothing out for delivery right now'}
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
            {f.status === 'on_the_way' && readyCount > 0 && (
              <span className="tabular ml-1.5 text-xs text-brand-600">({readyCount})</span>
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
          {visible.map(order => (
            <DeliveryCard key={order.id} order={order} onDeliver={courierName => markDelivered(order.id, courierName)} />
          ))}
        </div>
      )}
    </div>
  )
}

function DeliveryCard({ order, onDeliver }: { order: Order; onDeliver: (courierName?: string) => void }) {
  const [courierName, setCourierName] = useState(order.courierName ?? '')
  const store = MOCK_STORES.find(s => s.id === order.storeId)
  const itemSummary = order.items.map(i => `${i.quantity}× ${i.product.name}`).join(', ')

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
              store?.coverGradient ?? 'from-gray-400 to-gray-600'
            )}
          >
            <span className="font-display text-sm font-medium text-white/90">
              {order.storeName.trim()[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="tabular font-display text-base font-medium text-ink">{order.orderNumber}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-ink/45">{order.storeName} · {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <span className="tabular font-display text-base font-medium text-ink">{formatCurrency(order.total)}</span>
      </div>

      <p className="mt-3 text-sm text-ink/70">{itemSummary}</p>
      <p className="mt-1 text-xs text-ink/45">
        Deliver to {order.deliveryAddress.line1}, {order.deliveryAddress.postcode} · {order.deliverySlot}
      </p>

      {order.status === 'on_the_way' && (
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
          <input
            type="text"
            value={courierName}
            onChange={e => setCourierName(e.target.value)}
            placeholder="Courier name (optional)"
            className="w-48 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
          <Button size="sm" onClick={() => onDeliver(courierName.trim() || undefined)}>
            <Truck size={14} className="mr-1.5" />
            Mark delivered
          </Button>
        </div>
      )}

      {order.status === 'delivered' && order.courierName && (
        <p className="mt-3 border-t border-ink/10 pt-3 text-xs text-ink/45">Delivered by {order.courierName}</p>
      )}
    </div>
  )
}
