import { Link } from 'react-router-dom'
import { useStoresStore } from '@shared/stores/stores.store'
import { useOrdersStore } from '@shared/stores/orders.store'
import { useAdminUsersStore } from '@shared/stores/adminUsers.store'
import { OrderStatusBadge } from '@shared/components/OrderStatusBadge'
import { formatCurrency } from '@shared/lib/utils'
import type { OrderStatus } from '@shared/types'

const STATUS_ORDER: OrderStatus[] = ['confirmed', 'being_picked', 'on_the_way', 'delivered']

export function OverviewPage() {
  const stores = useStoresStore(s => s.stores)
  const orders = useOrdersStore(s => s.orders)
  const users = useAdminUsersStore(s => s.users)

  const openStores = stores.filter(s => s.isOpen).length
  const revenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const activeUsers = users.filter(u => u.status === 'active').length

  return (
    <div>
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Admin</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Overview</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Stores" value={String(stores.length)} sub={`${openStores} open now`} />
        <StatTile label="Orders" value={String(orders.length)} sub="all time" />
        <StatTile label="Users" value={String(users.length)} sub={`${activeUsers} active`} />
        <StatTile label="Delivered revenue" value={formatCurrency(revenue)} sub="all time" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <p className="section-kicker mb-4 text-[11px] font-semibold text-ink/45">Orders by status</p>
          <div className="space-y-3">
            {STATUS_ORDER.map(status => {
              const count = orders.filter(o => o.status === status).length
              return (
                <div key={status} className="flex items-center justify-between">
                  <OrderStatusBadge status={status} />
                  <span className="font-display text-lg font-medium text-ink">{count}</span>
                </div>
              )
            })}
          </div>
          <Link
            to="/admin/orders"
            className="mt-4 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            View all orders →
          </Link>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <p className="section-kicker mb-4 text-[11px] font-semibold text-ink/45">Stores</p>
          <div className="divide-y divide-ink/10">
            {stores.map(store => (
              <div key={store.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="text-sm text-ink">{store.name}</span>
                <span className={store.isOpen ? 'text-xs font-semibold text-brand-700' : 'text-xs text-ink/40'}>
                  {store.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/admin/stores"
            className="mt-4 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Manage stores →
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-ink/55">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-xs text-ink/40">{sub}</p>
    </div>
  )
}
