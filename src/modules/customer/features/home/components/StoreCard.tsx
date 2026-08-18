import { Clock3, MapPin, Star } from 'lucide-react'
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
        'overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_22px_44px_-36px_rgba(15,23,42,0.2)] transition-all',
        store.isOpen ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_24px_48px_-30px_rgba(15,23,42,0.24)]' : 'opacity-60'
      )}
    >
      <div className={cn('relative h-48 bg-gradient-to-br', store.coverGradient)}>
        {store.imageUrl && (
          <img src={store.imageUrl} alt={store.name} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.24))]" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-900 shadow-sm">
            {store.categoryTags[0]}
          </span>
          {!store.isOpen && (
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">
              Closed
            </span>
          )}
        </div>

        {!store.imageUrl && (
          <div className="absolute inset-x-4 bottom-4 rounded-[1.4rem] bg-white/90 p-4 backdrop-blur-sm">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-600">Featured store</p>
            <p className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900">{store.name}</p>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold tracking-[-0.03em] text-slate-900">{store.name}</h3>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={13} className="text-slate-400" />
              <span>{store.area}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
            <Star size={12} className="fill-current" />
            4.8
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {store.categoryTags.map(tag => (
            <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock3 size={14} className="text-slate-400" />
            <span>{store.estimatedDeliveryMin}-{store.estimatedDeliveryMax} min</span>
          </div>
          <span className="font-semibold text-slate-700">£{(store.minimumOrderValue / 100).toFixed(0)} min</span>
        </div>
      </div>
    </article>
  )
}
