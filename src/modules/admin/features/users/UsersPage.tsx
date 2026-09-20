import { useState } from 'react'
import { Users } from 'lucide-react'
import { Badge } from '@shared/components/Badge'
import { Button } from '@shared/components/Button'
import { cn, formatDate } from '@shared/lib/utils'
import { useAdminUsersStore } from '@shared/stores/adminUsers.store'
import type { UserRole } from '@shared/types'

const FILTERS: { label: string; role: UserRole | 'all' }[] = [
  { label: 'All', role: 'all' },
  { label: 'Customers', role: 'customer' },
  { label: 'Store partners', role: 'store_partner' },
  { label: 'Ops', role: 'ops' },
]

const ROLE_LABEL: Record<UserRole, string> = {
  customer: 'Customer',
  store_partner: 'Store partner',
  ops: 'Ops',
  admin: 'Admin',
}

export function UsersPage() {
  const { users, toggleStatus } = useAdminUsersStore()
  const [filter, setFilter] = useState<UserRole | 'all'>('all')

  const visible = filter === 'all' ? users : users.filter(u => u.role === filter)

  return (
    <div>
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Admin</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Users</h1>
        <p className="mt-2 text-sm text-ink/55">{users.length} accounts</p>
      </div>

      <div className="mb-6 flex gap-6 overflow-x-auto border-b border-ink/10 pb-px scrollbar-none">
        {FILTERS.map(f => (
          <button
            key={f.role}
            onClick={() => setFilter(f.role)}
            className={cn(
              'shrink-0 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors',
              filter === f.role ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink/45 hover:text-ink/70'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-ink/10 bg-white py-20 text-center shadow-sm">
          <Users size={28} className="mb-3 text-ink/25" />
          <p className="text-sm text-ink/50">No accounts in this view</p>
        </div>
      ) : (
        <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-sm">
          {visible.map(user => (
            <div key={user.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{user.name}</p>
                  <Badge variant="outline">{ROLE_LABEL[user.role]}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink/45">{user.contact} · Joined {formatDate(user.joinedAt)}</p>
              </div>

              <Badge variant={user.status === 'active' ? 'green' : 'red'}>
                {user.status === 'active' ? 'Active' : 'Suspended'}
              </Badge>

              <Button size="sm" variant="secondary" onClick={() => toggleStatus(user.id)}>
                {user.status === 'active' ? 'Suspend' : 'Reactivate'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
