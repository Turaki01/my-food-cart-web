import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { cn } from '@shared/lib/utils'
import { useCartStore } from '@shared/stores/cart.store'
import { Button } from '@shared/components/Button'
import { MOCK_STORES } from '@modules/customer/features/home/mock'
import { MOCK_PRODUCTS, getCategories } from './mock'
import { ProductCard } from './components/ProductCard'
import { BasketSidebar } from './components/BasketSidebar'
import { CategoryNav } from './components/CategoryNav'

interface PendingAdd {
  productId: string
}

export function CataloguePage() {
  const { storeId } = useParams<{ storeId: string }>()
  const { storeName: cartStoreName, clearCart, addItem } = useCartStore()
  const [conflictProduct, setConflictProduct] = useState<PendingAdd | null>(null)

  const store = MOCK_STORES.find(s => s.id === storeId)
  if (!store) return <Navigate to="/customer/home" replace />

  const products = MOCK_PRODUCTS[storeId ?? ''] ?? []
  const categories = getCategories(storeId ?? '')
  const grouped = categories.map(cat => ({
    category: cat,
    items: products.filter(p => p.category === cat),
  }))

  const handleConflict = (productId: string) => setConflictProduct({ productId })

  const handleConfirmSwitch = () => {
    if (!conflictProduct) return
    const product = products.find(p => p.id === conflictProduct.productId)
    if (!product) return
    clearCart()
    addItem(product, store.id, store.name, store.minimumOrderValue > 0 ? 349 : 0)
    setConflictProduct(null)
  }

  if (!store.isOpen) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center text-gray-400">
        <p className="text-sm font-medium text-gray-600 mb-1">{store.name} is currently closed</p>
        <p className="text-xs mb-4">Check back during opening hours</p>
        <Link to="/customer/home" className="text-xs text-brand-600 hover:underline">
          ← Back to stores
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back link */}
      <Link
        to="/customer/home"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft size={13} /> All stores
      </Link>

      {/* Store hero */}
      <div className={cn('relative h-44 rounded-3xl overflow-hidden bg-gradient-to-br mb-5', store.coverGradient)}>
        {store.imageUrl && (
          <img src={store.imageUrl} alt={store.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/15" />
        {!store.imageUrl && (
          <span className="absolute bottom-3 left-4 text-white/30 text-xs font-mono">[ store front photo ]</span>
        )}
      </div>

      {/* Store info bar */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{store.name}</h1>
          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-1 text-xs text-gray-500">
            {store.categoryTags.map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="mr-1.5 text-gray-300">·</span>}
                {tag}
              </span>
            ))}
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-0.5">
              <MapPin size={10} className="text-gray-400" />
              {store.area}
            </span>
          </div>
        </div>

        {/* Min order + delivery pill */}
        <span className="shrink-0 mt-0.5 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl px-3 py-1.5 text-xs font-medium">
          <Clock size={11} />
          {store.estimatedDeliveryMin}–{store.estimatedDeliveryMax} min
          <span className="text-amber-300">·</span>
          Min. £{(store.minimumOrderValue / 100).toFixed(0)}
          <span className="text-amber-300">·</span>
          Del. £3.49
        </span>
      </div>

      {/* Category nav */}
      <div className="mb-6">
        <CategoryNav categories={categories} />
      </div>

      <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <p className="text-xs font-medium text-amber-800">Launch mode: one store per order.</p>
        <p className="mt-1 text-xs leading-relaxed text-amber-700">
          You can browse every partner store, but your basket can only contain items from one store at a time.
        </p>
      </div>

      {/* Two-column layout: products | basket */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Product sections */}
        <div className="space-y-8">
          {grouped.map(({ category, items }) => (
            <section key={category} id={`cat-${CSS.escape(category)}`}>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{category}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    storeId={store.id}
                    storeName={store.name}
                    deliveryFee={349}
                    onConflict={() => handleConflict(product.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Basket sidebar */}
        <BasketSidebar minimumOrderValue={store.minimumOrderValue} />
      </div>

      {/* Cart conflict dialog */}
      {conflictProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">Start a new basket?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              At launch, orders are limited to one store at a time. You already have items from{' '}
              <span className="font-medium text-gray-800">{cartStoreName}</span> in your basket.
              Switching to{' '}
              <span className="font-medium text-gray-800">{store.name}</span> will clear it.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setConflictProduct(null)}
              >
                Keep current
              </Button>
              <Button fullWidth onClick={handleConfirmSwitch}>
                Start new
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
