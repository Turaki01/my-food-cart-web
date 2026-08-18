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
      <div className="mx-auto max-w-lg py-20 text-center text-slate-400">
        <p className="mb-1 text-sm font-semibold text-slate-700">{store.name} is currently closed</p>
        <p className="mb-4 text-xs">Check back during opening hours</p>
        <Link to="/customer/home" className="text-xs font-semibold text-brand-600 hover:underline">
          Back to stores
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        to="/customer/home"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft size={13} /> All stores
      </Link>

      <section className="paper-panel overflow-hidden rounded-[2rem] p-5 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.8fr]">
          <div
            className={cn(
              'relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br p-6 text-white md:p-7',
              store.coverGradient
            )}
          >
            {store.imageUrl && (
              <img src={store.imageUrl} alt={store.name} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.32))]" />
            <div className="relative">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
                Partner store
              </span>
              <h1 className="mt-4 max-w-md text-4xl font-extrabold leading-[0.95] tracking-[-0.05em]">
                {store.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/85">
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

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5">
            <p className="section-kicker text-[11px] font-bold text-brand-600">Store details</p>
            <div className="mt-4 flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
              <Star size={14} className="fill-current" />
              4.8 rated by local shoppers
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {store.categoryTags.map(tag => (
                <span key={tag} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Minimum order</span>
                <span className="font-bold text-slate-900">£{(store.minimumOrderValue / 100).toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span>Delivery fee</span>
                <span className="font-bold text-slate-900">£3.49</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="paper-panel rounded-[1.8rem] py-3">
        <CategoryNav categories={categories} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {grouped.map(({ category, items }) => (
            <section key={category} id={`cat-${CSS.escape(category)}`}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="section-kicker text-[11px] font-bold text-brand-600">Category</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-slate-900">{category}</h2>
                </div>
                <span className="text-xs font-medium text-slate-400">{items.length} items</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="mb-1.5 text-base font-semibold text-slate-900">Start a new basket?</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-500">
              You already have items from{' '}
              <span className="font-medium text-slate-800">{cartStoreName}</span> in your basket.
              Switching to <span className="font-medium text-slate-800">{store.name}</span> will clear it.
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
