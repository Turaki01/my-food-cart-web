import { useNavigate } from 'react-router-dom'
import { cn } from '@shared/lib/utils'
import type { MockStore } from '../mock'

interface StoreCardProps {
  store: MockStore
}

export function StoreCard({ store }: StoreCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!store.isOpen) return
    navigate(`/customer/store/${store.id}`)
  }

  return (
    <article
      role={store.isOpen ? 'button' : undefined}
      tabIndex={store.isOpen ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={event => event.key === 'Enter' && handleClick()}
      className={cn(
        'group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-shadow',
        store.isOpen ? 'cursor-pointer hover:shadow-md' : 'opacity-50'
      )}
    >
      <div className={cn('relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br', store.coverGradient)}>
        {store.imageUrl ? (
          <img
            src={store.imageUrl}
            alt={store.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span className="font-display text-6xl font-medium leading-none text-white/85">
            {store.name.trim()[0]?.toUpperCase()}
          </span>
        )}

        {!store.isOpen && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--paper)]">
            Closed
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-medium leading-tight text-ink">{store.name}</h3>
          <span className="tabular shrink-0 pt-0.5 text-sm font-semibold text-ink/70">★ 4.8</span>
        </div>
        <p className="mt-1 text-xs text-ink/50">{store.area}</p>

        <p className="mt-3 text-[11px] uppercase tracking-[0.08em] text-ink/40">
          {store.categoryTags.join(' · ')}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-ink/55">
          <span>{store.estimatedDeliveryMin}–{store.estimatedDeliveryMax} min</span>
          <span className="tabular font-semibold text-ink/70">£{(store.minimumOrderValue / 100).toFixed(0)} min order</span>
        </div>
      </div>
    </article>
  )
}
