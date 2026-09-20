import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { newStoreSchema, type NewStoreFormValues } from './stores.schema'

interface AddStoreModalProps {
  onClose: () => void
  onSubmit: (values: {
    name: string
    area: string
    categoryTags: string[]
    minimumOrderValue: number
    estimatedDeliveryMin: number
    estimatedDeliveryMax: number
  }) => void
}

export function AddStoreModal({ onClose, onSubmit }: AddStoreModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof newStoreSchema>, unknown, NewStoreFormValues>({
    resolver: zodResolver(newStoreSchema),
    defaultValues: {
      name: '',
      area: '',
      categoryTags: '',
      minimumOrderValue: undefined,
      estimatedDeliveryMin: undefined,
      estimatedDeliveryMax: undefined,
    },
  })

  const submit = async (values: NewStoreFormValues) => {
    onSubmit({
      name: values.name,
      area: values.area,
      categoryTags: values.categoryTags.split(',').map(tag => tag.trim()).filter(Boolean),
      minimumOrderValue: Math.round(values.minimumOrderValue * 100),
      estimatedDeliveryMin: values.estimatedDeliveryMin,
      estimatedDeliveryMax: values.estimatedDeliveryMax,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-ink/10 bg-white p-7 shadow-lg">
        <h3 className="mb-1.5 font-display text-lg font-medium text-ink">Onboard a store</h3>
        <p className="mb-6 text-sm text-ink/55">The store goes live for customers immediately.</p>

        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Store name"
            placeholder="Enter store name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Area"
            placeholder="e.g. Brixton"
            error={errors.area?.message}
            {...register('area')}
          />
          <Input
            label="Categories"
            placeholder="e.g. West African, Fresh Produce"
            hint="Comma-separated"
            error={errors.categoryTags?.message}
            {...register('categoryTags')}
          />
          <Input
            label="Minimum order value (£)"
            type="number"
            step="0.01"
            error={errors.minimumOrderValue?.message}
            {...register('minimumOrderValue')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Delivery min (mins)"
              type="number"
              error={errors.estimatedDeliveryMin?.message}
              {...register('estimatedDeliveryMin')}
            />
            <Input
              label="Delivery max (mins)"
              type="number"
              error={errors.estimatedDeliveryMax?.message}
              {...register('estimatedDeliveryMax')}
            />
          </div>

          <div className="mt-2 flex gap-3">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Onboard store
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
