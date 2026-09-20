import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { cn, formatCurrency, formatDate } from '@shared/lib/utils'
import { useOrdersStore } from '@shared/stores/orders.store'
import { OrderStatusBadge } from '@shared/components/OrderStatusBadge'
import { useReorder } from './useReorder'

export function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const reorder = useReorder()
  const order = useOrdersStore(s => s.orders.find(o => o.orderNumber === orderNumber))

  if (!order) return <Navigate to="/customer/orders" replace />

  const canReorder = order.items.some(i => i.product.inStock)

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/customer/orders"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink/55 transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> Order history
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 pb-6">
        <div>
          <p className="section-kicker text-[11px] font-semibold text-ink/45">Order {order.orderNumber}</p>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">{order.storeName}</h1>
          <p className="mt-2 text-sm text-ink/55">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mb-4 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-sm">
        <div className="px-6 py-5">
          <p className="section-kicker mb-3 text-[11px] font-semibold text-ink/45">Items</p>
          <div className="space-y-2.5">
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="tabular shrink-0 text-xs font-semibold text-ink/40">{quantity}×</span>
                  <span className={cn('text-sm', product.inStock ? 'text-ink' : 'text-ink/40 line-through')}>
                    {product.name}
                  </span>
                  {!product.inStock && (
                    <span className="text-[11px] text-ink/40">no longer available</span>
                  )}
                </div>
                <span className="tabular text-xs font-medium text-ink/60">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 px-6 py-5">
          <p className="section-kicker text-[11px] font-semibold text-ink/45">Delivery</p>
          <div className="flex items-start gap-2.5">
            <MapPin size={13} className="mt-0.5 shrink-0 text-ink/40" />
            <div>
              <p className="text-sm text-ink">
                {order.deliveryAddress.line1}
                {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}
              </p>
              <p className="text-xs text-ink/45">{order.deliveryAddress.postcode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={13} className="shrink-0 text-ink/40" />
            <p className="text-sm text-ink">{order.deliverySlot}</p>
          </div>
          {order.courierName && (
            <p className="text-xs text-ink/45">Courier: {order.courierName}</p>
          )}
        </div>

        <div className="space-y-2 px-6 py-5">
          <p className="section-kicker mb-3 text-[11px] font-semibold text-ink/45">Payment</p>
          <SummaryRow label="Subtotal" value={formatCurrency(order.subtotal)} />
          <SummaryRow label="Delivery" value={formatCurrency(order.deliveryFee)} />
          <div className="border-t border-ink/10 pt-2">
            <SummaryRow label="Total paid" value={formatCurrency(order.total)} bold />
          </div>
        </div>
      </div>

      <Button fullWidth disabled={!canReorder} onClick={() => reorder(order)}>
        {canReorder ? 'Reorder' : 'Items unavailable'}
      </Button>
    </div>
  )
}

function SummaryRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={cn('flex justify-between', bold ? 'text-sm font-semibold text-ink' : 'text-xs text-ink/55')}>
      <span>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  )
}
