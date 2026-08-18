import { Minus, Plus } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useCartStore } from '@shared/stores/cart.store'
import type { MockProduct } from '../mock'

interface ProductCardProps {
  product: MockProduct
  storeId: string
  storeName: string
  deliveryFee: number
  onConflict: () => void
}

export function ProductCard({ product, storeId, storeName, deliveryFee, onConflict }: ProductCardProps) {
  const { addItem, updateQuantity, getQuantity } = useCartStore()
  const quantity = getQuantity(product.id)

  const handleAdd = () => {
    const result = addItem(product, storeId, storeName, deliveryFee)
    if (result === 'conflict') onConflict()
  }

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_20px_40px_-34px_rgba(15,23,42,0.18)] transition-all',
        product.inStock ? 'hover:-translate-y-0.5 hover:border-slate-300' : 'opacity-60'
      )}
    >
      <div className={cn('relative aspect-square border-b border-slate-100', getProductTone(product.category))}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col justify-between p-4">
            <span className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
              {product.category}
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Pantry staple</p>
              <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-slate-900">{product.hint}</p>
            </div>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/45">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-500">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-sm font-bold leading-snug text-slate-900">{product.name}</h4>
          <p className="mt-1 text-xs text-slate-500">{product.unit}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold tracking-[-0.03em] text-slate-900">
            £{(product.price / 100).toFixed(2)}
          </span>

          {!product.inStock ? null : quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="rounded-full bg-brand-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-700"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300"
                aria-label="Decrease quantity"
              >
                <Minus size={11} />
              </button>
              <span className="w-4 text-center text-sm font-bold text-slate-900 tabular-nums">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300"
                aria-label="Increase quantity"
              >
                <Plus size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function getProductTone(category: string) {
  if (category.toLowerCase().includes('fresh')) return 'bg-[linear-gradient(135deg,#eefaf1,#fdfef8)]'
  if (category.toLowerCase().includes('frozen')) return 'bg-[linear-gradient(135deg,#edf5ff,#fafcff)]'
  return 'bg-[linear-gradient(135deg,#fff4ea,#fffaf4)]'
}
