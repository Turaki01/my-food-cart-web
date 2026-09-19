import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Switch } from '@shared/components/Switch'
import { Badge } from '@shared/components/Badge'
import { cn, formatCurrency } from '@shared/lib/utils'
import { usePartnerStoreProfile } from '@shared/stores/partnerStore.store'
import { computeIsOpenFromHours, describeAvailability, DAY_ORDER } from '@modules/store-partner/lib/hours'
import { storeSettingsSchema, type StoreSettingsFormValues } from './settings.schema'

export function SettingsPage() {
  const { profile, updateProfile, updateDayHours, setManualOverride } = usePartnerStoreProfile()
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      minimumOrderValue: profile.minimumOrderValue / 100,
      estimatedDeliveryMin: profile.estimatedDeliveryMin,
      estimatedDeliveryMax: profile.estimatedDeliveryMax,
    },
  })

  const scheduledIsOpen = computeIsOpenFromHours(profile.hours)
  const effectiveIsOpen = profile.manualOverride ? profile.manualOverrideValue : scheduledIsOpen

  const onSubmit = async (values: StoreSettingsFormValues) => {
    updateProfile({
      minimumOrderValue: Math.round(values.minimumOrderValue * 100),
      estimatedDeliveryMin: values.estimatedDeliveryMin,
      estimatedDeliveryMax: values.estimatedDeliveryMax,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="section-kicker text-[11px] font-semibold text-brand-600">Store partner</p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
              profile.coverGradient
            )}
          >
            <span className="font-display text-xl font-medium text-white/90">
              {profile.name.trim()[0]?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-medium text-ink">{profile.name}</p>
            <p className="text-sm text-ink/55">{profile.area}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker mb-2 text-[11px] font-semibold text-ink/45">Availability</p>
              <div className="flex items-center gap-2">
                <Badge variant={effectiveIsOpen ? 'green' : 'red'}>
                  {effectiveIsOpen ? 'Open now' : 'Closed now'}
                </Badge>
                <span className="text-xs text-ink/45">
                  {profile.manualOverride ? 'Manually overridden' : describeAvailability(profile.hours)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {DAY_ORDER.map(day => {
              const hours = profile.hours.find(h => h.day === day)!
              return (
                <div key={day} className="flex flex-wrap items-center gap-3 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0">
                  <div className="flex w-24 shrink-0 items-center gap-2.5">
                    <Switch
                      checked={hours.enabled}
                      onChange={checked => updateDayHours(day, { enabled: checked })}
                      label={`Trading on ${day}`}
                    />
                    <span className="text-sm font-medium text-ink">{day}</span>
                  </div>

                  {hours.enabled ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={e => updateDayHours(day, { open: e.target.value })}
                        aria-label={`${day} opening time`}
                        className="rounded-md border border-ink/15 bg-white px-2 py-1.5 text-sm text-ink tabular focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                      />
                      <span className="text-xs text-ink/40">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={e => updateDayHours(day, { close: e.target.value })}
                        aria-label={`${day} closing time`}
                        className="rounded-md border border-ink/15 bg-white px-2 py-1.5 text-sm text-ink tabular focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-ink/40">Closed</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 border-t border-ink/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">Manual override</p>
                <p className="mt-0.5 text-xs text-ink/50">
                  Force your status regardless of the schedule above — e.g. pausing early.
                </p>
              </div>
              <Switch
                checked={profile.manualOverride}
                onChange={checked => setManualOverride(checked)}
                label="Manual override"
              />
            </div>

            {profile.manualOverride && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManualOverride(true, true)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                    profile.manualOverrideValue ? 'bg-brand-600 text-white' : 'border border-ink/15 text-ink/60 hover:bg-gray-50'
                  )}
                >
                  Force open
                </button>
                <button
                  type="button"
                  onClick={() => setManualOverride(true, false)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                    !profile.manualOverrideValue ? 'bg-red-600 text-white' : 'border border-ink/15 text-ink/60 hover:bg-gray-50'
                  )}
                >
                  Force closed
                </button>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm"
          noValidate
        >
          <p className="section-kicker mb-4 text-[11px] font-semibold text-ink/45">Order settings</p>

          <div className="space-y-4">
            <Input
              label="Minimum order value (£)"
              type="number"
              step="0.01"
              error={errors.minimumOrderValue?.message}
              {...register('minimumOrderValue')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Delivery estimate — min (mins)"
                type="number"
                error={errors.estimatedDeliveryMin?.message}
                {...register('estimatedDeliveryMin')}
              />
              <Input
                label="Delivery estimate — max (mins)"
                type="number"
                error={errors.estimatedDeliveryMax?.message}
                {...register('estimatedDeliveryMax')}
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-ink/45">
            Customers currently see: {formatCurrency(profile.minimumOrderValue)} minimum ·{' '}
            {profile.estimatedDeliveryMin}–{profile.estimatedDeliveryMax} min delivery
          </p>

          <div className="mt-5 flex items-center gap-3">
            <Button type="submit" loading={isSubmitting}>
              Save changes
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                <CheckCircle2 size={15} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
