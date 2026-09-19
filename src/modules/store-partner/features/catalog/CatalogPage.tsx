import { useRef, useState } from 'react'
import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Switch } from '@shared/components/Switch'
import { readFileAsDataUrl } from '@shared/lib/file'
import { usePartnerCatalogStore, type PartnerProduct } from '@shared/stores/partnerCatalog.store'
import { ProductFormModal } from './ProductFormModal'

export function CatalogPage() {
  const { products, updateQuantity, toggleManualOverride, updatePrice, updateImage, addProduct, removeProduct } =
    usePartnerCatalogStore()
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = [...new Set(products.map(p => p.category))]
  const outOfStockCount = products.filter(p => !p.inStock).length

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker text-[11px] font-semibold text-brand-600">Store partner</p>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Catalogue</h1>
          <p className="mt-2 text-sm text-ink/55">
            {products.length} products
            {outOfStockCount > 0 ? ` · ${outOfStockCount} unavailable` : ''}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={15} className="mr-1.5" />
          Add product
        </Button>
      </div>

      <div className="space-y-8">
        {categories.map(category => (
          <section key={category}>
            <h2 className="mb-3 border-b border-ink/10 pb-3 font-display text-lg font-medium text-ink">
              {category}
            </h2>

            <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white shadow-sm">
              {products
                .filter(p => p.category === category)
                .map(product => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onQuantityChange={qty => updateQuantity(product.id, qty)}
                    onPriceChange={price => updatePrice(product.id, price)}
                    onToggleOverride={() => toggleManualOverride(product.id)}
                    onImageChange={dataUrl => updateImage(product.id, dataUrl)}
                    onRemove={() => removeProduct(product.id)}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>

      {showAddModal && (
        <ProductFormModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSubmit={values => {
            addProduct(values)
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

function ProductRow({
  product,
  onQuantityChange,
  onPriceChange,
  onToggleOverride,
  onImageChange,
  onRemove,
}: {
  product: PartnerProduct
  onQuantityChange: (quantity: number) => void
  onPriceChange: (price: number) => void
  onToggleOverride: () => void
  onImageChange: (dataUrl: string) => void
  onRemove: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onImageChange(await readFileAsDataUrl(file))
  }

  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        aria-label={`Change photo for ${product.name}`}
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/15 bg-gray-50 text-ink/30 transition-colors hover:border-brand-600 hover:text-brand-600"
      >
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus size={16} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{product.name}</p>
        <p className="text-xs text-ink/45">{product.unit}</p>
      </div>

      <div className="flex items-center gap-1 text-sm text-ink/55">
        £
        <input
          type="number"
          step="0.01"
          defaultValue={(product.price / 100).toFixed(2)}
          onBlur={e => {
            const value = Number(e.target.value)
            if (Number.isFinite(value) && value > 0) onPriceChange(Math.round(value * 100))
          }}
          className="w-20 rounded-md border border-ink/15 bg-white px-2 py-1 text-sm text-ink tabular focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
      </div>

      <div className="flex items-center gap-1.5 text-sm text-ink/55">
        <input
          type="number"
          min={0}
          defaultValue={product.quantity}
          onBlur={e => {
            const value = Number(e.target.value)
            if (Number.isFinite(value)) onQuantityChange(Math.round(value))
          }}
          aria-label={`Quantity in stock for ${product.name}`}
          className="w-16 rounded-md border border-ink/15 bg-white px-2 py-1 text-sm text-ink tabular focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
        <span className="text-xs text-ink/40">in stock</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={!product.manuallyUnavailable}
          onChange={onToggleOverride}
          label={`Available toggle for ${product.name}`}
        />
        <span className={product.inStock ? 'w-24 text-xs text-brand-700' : 'w-24 text-xs text-red-600'}>
          {product.manuallyUnavailable
            ? 'Hidden'
            : product.quantity > 0
              ? 'Available'
              : 'Out of stock'}
        </span>
      </div>

      <button
        onClick={onRemove}
        aria-label={`Remove ${product.name}`}
        className="rounded-md p-2 text-ink/40 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
