import { Minus, Plus } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useCartStore } from '@shared/stores/cart.store'
import { Badge } from '@shared/components/Badge'
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
        'group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-shadow',
        product.inStock ? 'hover:shadow-md' : 'opacity-50'
      )}
    >
      <div className="relative aspect-square border-b border-ink/10 bg-gray-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-4">
            <span className="section-kicker text-[10px] font-semibold text-ink/40">{product.category}</span>
            <p className="font-display text-xl font-medium leading-tight text-ink/70">{product.hint}</p>
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[--paper]/90">
            <Badge variant="gray">Out of stock</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-sm font-semibold leading-snug text-ink">{product.name}</h4>
          <p className="mt-1 text-xs text-ink/50">{product.unit}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="tabular font-display text-lg font-medium text-ink">
            £{(product.price / 100).toFixed(2)}
          </span>

          {!product.inStock ? null : quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/15 text-ink/70 transition-colors hover:border-brand-600 hover:text-brand-600"
                aria-label="Decrease quantity"
              >
                <Minus size={11} />
              </button>
              <span className="tabular w-4 text-center text-sm font-semibold text-ink">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/15 text-ink/70 transition-colors hover:border-brand-600 hover:text-brand-600"
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
