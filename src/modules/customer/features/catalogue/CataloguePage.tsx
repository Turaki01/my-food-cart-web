import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock3, MapPin, Star } from 'lucide-react'
import { useCartStore } from '@shared/stores/cart.store'
import { Button } from '@shared/components/Button'
import { cn } from '@shared/lib/utils'
import { MOCK_STORES } from '@modules/customer/features/home/mock'
import { BasketSidebar } from './components/BasketSidebar'
import { CategoryNav } from './components/CategoryNav'
import { ProductCard } from './components/ProductCard'
import { MOCK_PRODUCTS, getCategories } from './mock'

interface PendingAdd {
  productId: string
}

export function CataloguePage() {
  const { storeId } = useParams<{ storeId: string }>()
  const { storeName: cartStoreName, clearCart, addItem } = useCartStore()
  const [conflictProduct, setConflictProduct] = useState<PendingAdd | null>(null)

  const store = MOCK_STORES.find(item => item.id === storeId)
  if (!store) return <Navigate to="/customer/home" replace />

  const products = MOCK_PRODUCTS[storeId ?? ''] ?? []
  const categories = getCategories(storeId ?? '')
  const grouped = categories.map(category => ({
    category,
    items: products.filter(product => product.category === category),
  }))

  const handleConflict = (productId: string) => setConflictProduct({ productId })

  const handleConfirmSwitch = () => {
    if (!conflictProduct) return
    const product = products.find(item => item.id === conflictProduct.productId)
    if (!product) return
    clearCart()
    addItem(product, store.id, store.name, store.minimumOrderValue > 0 ? 349 : 0)
    setConflictProduct(null)
  }

  if (!store.isOpen) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="mb-1 text-sm font-semibold text-ink">{store.name} is currently closed</p>
        <p className="mb-4 text-xs text-ink/50">Check back during opening hours</p>
        <Link to="/customer/home" className="underline-hover text-xs font-semibold text-ink/70 hover:text-ink">
          Back to stores
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <Link
        to="/customer/home"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/55 transition-colors hover:text-ink"
      >
        <ArrowLeft size={13} /> All stores
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.8fr]">
        <div className={cn('relative flex min-h-[13rem] items-end overflow-hidden rounded-xl bg-gradient-to-br p-7 shadow-sm', store.coverGradient)}>
          {store.imageUrl ? (
            <img src={store.imageUrl} alt={store.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="pointer-events-none absolute right-6 top-4 font-display text-8xl font-medium leading-none text-white/25">
              {store.name.trim()[0]?.toUpperCase()}
            </span>
          )}
          <div className="relative text-white">
            <p className="section-kicker text-[11px] font-semibold text-white/70">Partner store</p>
            <h1 className="mt-2 max-w-md font-display text-3xl font-medium leading-[1.04] tracking-[-0.02em] md:text-4xl">
              {store.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {store.area}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {store.estimatedDeliveryMin}-{store.estimatedDeliveryMax} min
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <p className="section-kicker text-[11px] font-semibold text-brand-600">Store details</p>
          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            4.8 rated by local shoppers
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.08em] text-ink/40">
            {store.categoryTags.join(' · ')}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/40">Minimum order</dt>
              <dd className="tabular mt-1 font-display text-xl font-medium text-ink">£{(store.minimumOrderValue / 100).toFixed(0)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/40">Delivery fee</dt>
              <dd className="tabular mt-1 font-display text-xl font-medium text-ink">£3.49</dd>
            </div>
          </dl>
        </div>
      </section>

      <CategoryNav categories={categories} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          {grouped.map(({ category, items }) => (
            <section key={category} id={`cat-${CSS.escape(category)}`} className="scroll-mt-24">
              <div className="mb-5 flex items-end justify-between gap-3 border-b border-ink/10 pb-3">
                <h2 className="font-display text-xl font-medium tracking-[-0.01em] text-ink">{category}</h2>
                <span className="text-xs text-ink/40">{items.length} items</span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
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

        <BasketSidebar minimumOrderValue={store.minimumOrderValue} />
      </div>

      {conflictProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-sm rounded-xl border border-ink/10 bg-white p-7 shadow-lg">
            <h3 className="mb-1.5 font-display text-lg font-medium text-ink">Start a new basket?</h3>
            <p className="mb-6 text-sm leading-relaxed text-ink/55">
              You already have items from{' '}
              <span className="font-semibold text-ink">{cartStoreName}</span> in your basket.
              Switching to <span className="font-semibold text-ink">{store.name}</span> will clear it.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setConflictProduct(null)}>
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
