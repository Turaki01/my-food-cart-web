import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { readFileAsDataUrl } from '@shared/lib/file'
import { newProductSchema, type NewProductFormValues } from './catalog.schema'

const NEW_CATEGORY_VALUE = '__new__'

interface ProductFormModalProps {
  categories: string[]
  onClose: () => void
  onSubmit: (values: {
    name: string
    category: string
    unit: string
    price: number
    quantity: number
    imageUrl?: string
  }) => void
}

export function ProductFormModal({ categories, onClose, onSubmit }: ProductFormModalProps) {
  const [isNewCategory, setIsNewCategory] = useState(categories.length === 0)
  const [imagePreview, setImagePreview] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewProductFormValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: { name: '', category: '', unit: '', price: undefined, quantity: undefined },
  })

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === NEW_CATEGORY_VALUE) {
      setIsNewCategory(true)
      setValue('category', '')
    } else {
      setValue('category', e.target.value, { shouldValidate: true })
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setImagePreview(dataUrl)
  }

  const submit = async (values: NewProductFormValues) => {
    onSubmit({ ...values, price: Math.round(values.price * 100), imageUrl: imagePreview })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-ink/10 bg-white p-7 shadow-lg">
        <h3 className="mb-1.5 font-display text-lg font-medium text-ink">Add product</h3>
        <p className="mb-6 text-sm text-ink/55">New items appear in your catalogue immediately.</p>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink/70">Photo</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-ink/20 bg-gray-50 text-ink/40 transition-colors hover:border-brand-600 hover:text-brand-600"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={22} />
              )}
            </button>
          </div>

          <Input
            label="Product name"
            placeholder="Enter product name"
            error={errors.name?.message}
            {...register('name')}
          />

          {isNewCategory ? (
            <Input
              label="Category"
              placeholder="Enter category, e.g. Fresh Produce"
              error={errors.category?.message}
              {...register('category')}
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category-select" className="text-sm font-medium text-ink/70">Category</label>
              <select
                id="category-select"
                defaultValue=""
                onChange={handleCategorySelect}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-base text-ink focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
              >
                <option value="" disabled>Choose a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value={NEW_CATEGORY_VALUE}>+ Add new category</option>
              </select>
              {errors.category?.message && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Unit"
              placeholder="e.g. 1kg"
              error={errors.unit?.message}
              {...register('unit')}
            />
            <Input
              label="Price (£)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          <Input
            label="Quantity in stock"
            type="number"
            placeholder="0"
            error={errors.quantity?.message}
            {...register('quantity')}
          />

          <div className="mt-2 flex gap-3">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Add product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
