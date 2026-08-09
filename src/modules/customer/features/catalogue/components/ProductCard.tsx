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
  const qty = getQuantity(product.id)

  const handleAdd = () => {
    const result = addItem(product, storeId, storeName, deliveryFee)
    if (result === 'conflict') onConflict()
  }

  return (
    <div className={cn(
      'bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-150',
      product.inStock ? 'hover:border-brand-200 hover:shadow-sm' : 'opacity-55'
    )}>
      {/* Image area */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="absolute bottom-2 left-2.5 text-[10px] text-stone-400 font-mono leading-none">
            {product.hint}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <span className="text-[10px] font-medium bg-white text-gray-500 rounded-full px-2 py-0.5 border border-gray-200">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 leading-snug mb-0.5">{product.name}</h4>
        <p className="text-xs text-gray-400 mb-3">{product.unit}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            £{(product.price / 100).toFixed(2)}
          </span>

          {!product.inStock ? null : qty === 0 ? (
            <button
              onClick={handleAdd}
              className="px-3 py-1 rounded-lg border border-brand-600 text-brand-600 text-xs font-semibold hover:bg-brand-50 active:scale-95 transition-all"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={11} />
              </button>
              <span className="text-sm font-semibold w-4 text-center tabular-nums">{qty}</span>
              <button
                onClick={() => updateQuantity(product.id, qty + 1)}
                className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={11} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
