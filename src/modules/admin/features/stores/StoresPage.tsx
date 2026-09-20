import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Switch } from '@shared/components/Switch'
import { cn, formatCurrency } from '@shared/lib/utils'
import { Button } from '@shared/components/Button'
import { useStoresStore } from '@shared/stores/stores.store'
import type { MockStore } from '@modules/customer/features/home/mock'
import { AddStoreModal } from './AddStoreModal'

const GRADIENTS = [
  'from-spice-400 to-spice-600',
  'from-brand-500 to-brand-800',
  'from-stone-400 to-stone-600',
  'from-amber-500 to-amber-700',
]

export function StoresPage() {
  const { stores, addStore, updateStore } = useStoresStore()
  const [showAddModal, setShowAddModal] = useState(false)

  const openCount = stores.filter(s => s.isOpen).length

  const handleAdd = (values: Omit<MockStore, 'id' | 'isOpen' | 'coverGradient'>) => {
    addStore({
      ...values,
      id: `s-${Date.now().toString(36)}`,
      isOpen: true,
      coverGradient: GRADIENTS[stores.length % GRADIENTS.length],
    })
    setShowAddModal(false)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker text-[11px] font-semibold text-brand-600">Admin</p>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Stores</h1>
          <p className="mt-2 text-sm text-ink/55">{stores.length} stores · {openCount} open now</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={15} className="mr-1.5" />
          Onboard store
        </Button>
      </div>

      <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-sm">
        {stores.map(store => (
          <div key={store.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                store.coverGradient
              )}
            >
              <span className="font-display text-lg font-medium text-white/90">
                {store.name.trim()[0]?.toUpperCase()}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{store.name}</p>
              <p className="text-xs text-ink/45">{store.area} · {store.categoryTags.join(', ')}</p>
            </div>

            <div className="text-right text-xs text-ink/45">
              <p className="tabular">{formatCurrency(store.minimumOrderValue)} min</p>
              <p className="tabular">{store.estimatedDeliveryMin}–{store.estimatedDeliveryMax} min delivery</p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={store.isOpen}
                onChange={checked => updateStore(store.id, { isOpen: checked })}
                label={`Open toggle for ${store.name}`}
              />
              <span className={cn('w-12 text-xs', store.isOpen ? 'text-brand-700' : 'text-ink/40')}>
                {store.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddStoreModal onClose={() => setShowAddModal(false)} onSubmit={handleAdd} />
      )}
    </div>
  )
}
