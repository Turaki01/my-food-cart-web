import { Clock, MapPin } from 'lucide-react'
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
    <div
      role={store.isOpen ? 'button' : undefined}
      tabIndex={store.isOpen ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      onClick={handleClick}
      className={cn(
        'group bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-200',
        store.isOpen
          ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
          : 'opacity-60 cursor-default'
      )}
    >
      {/* Cover */}
      <div className={cn('relative h-44 bg-gradient-to-br', store.coverGradient)}>
        {store.imageUrl && (
          <img src={store.imageUrl} alt={store.name} className="absolute inset-0 h-full w-full object-cover" />
        )}
        {/* Dark overlay for closed stores */}
        {!store.isOpen && <div className="absolute inset-0 bg-black/30" />}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm',
            store.isOpen
              ? 'bg-white/90 text-brand-700'
              : 'bg-black/50 text-white'
          )}>
            <span className={cn('h-1.5 w-1.5 rounded-full', store.isOpen ? 'bg-brand-500' : 'bg-gray-400')} />
            {store.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>

        {/* Photo placeholder label */}
        {!store.imageUrl && (
          <div className="absolute bottom-2.5 left-3">
            <span className="text-white/40 text-[11px] font-mono">[ store front photo ]</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className={cn(
            'font-semibold text-[15px] leading-snug transition-colors',
            store.isOpen ? 'text-gray-900 group-hover:text-brand-700' : 'text-gray-600'
          )}>
            {store.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500">{store.area}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {store.categoryTags.map(tag => (
            <span key={tag} className="text-[11px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-gray-400" />
            <span>{store.estimatedDeliveryMin}–{store.estimatedDeliveryMax} min</span>
          </div>
          <span>Min. £{(store.minimumOrderValue / 100).toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
