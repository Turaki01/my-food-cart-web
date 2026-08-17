import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, MapPin, Clock, Store } from 'lucide-react'
import { BrandIcon } from '@shared/components/Logo'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Card } from '@shared/components/Card'
import { useLocationStore } from '@shared/stores/location.store'
import { checkDeliveryZone } from '@shared/lib/zones'
import { joinWaitlist } from '@shared/lib/api'
import {
  postcodeSchema,
  waitlistSchema,
  type PostcodeFormValues,
  type WaitlistFormValues,
} from './zone.schema'
import type { DeliveryZone } from '@shared/types'

type Step = 'postcode' | 'in-zone' | 'out-of-zone' | 'waitlisted'

export function ZoneCheckPage() {
  const navigate = useNavigate()
  const setZoneCheckComplete = useLocationStore(s => s.setZoneCheckComplete)
  const [step, setStep] = useState<Step>('postcode')
  const [matchedZone, setMatchedZone] = useState<DeliveryZone | null>(null)
  const [enteredPostcode, setEnteredPostcode] = useState('')

  const postcodeForm = useForm<PostcodeFormValues>({
    resolver: zodResolver(postcodeSchema),
  })

  const waitlistForm = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
  })

  const handlePostcodeSubmit = ({ postcode }: PostcodeFormValues) => {
    setEnteredPostcode(postcode.toUpperCase())
    const result = checkDeliveryZone(postcode)
    if (result.inZone && result.zone) {
      setMatchedZone(result.zone)
      setStep('in-zone')
    } else {
      setStep('out-of-zone')
    }
  }

  const handleWaitlistSubmit = async (data: WaitlistFormValues) => {
    await joinWaitlist({ ...data, postcode: enteredPostcode })
    setStep('waitlisted')
  }

  const handleContinue = () => {
    setZoneCheckComplete(matchedZone?.name ?? 'your area', enteredPostcode)
    navigate('/customer/home', { replace: true })
  }

  return (
    <div className="relative min-h-[100dvh] bg-brand-700 flex flex-col items-center justify-center px-5 py-10 overflow-hidden">
      {/* Ambient texture, echoes the home hero */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg, #fff 0px, #fff 1px, transparent 1px, transparent 14px
          )`,
        }}
      />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-spice-500/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm space-y-5">
        <div className="flex items-center justify-center gap-2.5 mb-1">
          <BrandIcon size={36} />
          <span className="font-semibold text-base text-white">My Food Cart</span>
        </div>

        {step === 'postcode' && (
          <Card className="shadow-xl">
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                <MapPin className="text-brand-600" size={24} />
              </div>
              <h1 className="font-display text-2xl font-semibold text-gray-900">
                Where should we deliver?
              </h1>
              <p className="text-sm text-gray-500">
                Every African &amp; Caribbean store in your area, in one basket
              </p>
            </div>

            <form onSubmit={postcodeForm.handleSubmit(handlePostcodeSubmit)} className="flex flex-col gap-4" noValidate>
              <Input
                label="Your postcode"
                placeholder="SE15 4RH"
                {...postcodeForm.register('postcode')}
                error={postcodeForm.formState.errors.postcode?.message}
              />
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={postcodeForm.formState.isSubmitting}
              >
                Check delivery
              </Button>
            </form>

            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-gray-100 text-xs text-gray-400">
              <Store size={13} className="text-gray-400 shrink-0" />
              Browse freely — you only sign in when you're ready to order
            </div>
          </Card>
        )}

        {step === 'in-zone' && matchedZone && (
          <Card className="shadow-xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="text-brand-600" size={48} />
              <h2 className="font-display text-xl font-semibold text-gray-900">Great news!</h2>
              <p className="text-gray-600">
                We deliver to <span className="font-semibold text-brand-700">{matchedZone.name}</span>.
              </p>
              <div className="flex items-center gap-2 bg-brand-50 text-brand-700 rounded-2xl px-4 py-2.5 text-sm font-medium">
                <Clock size={16} />
                Estimated delivery: {matchedZone.estimatedMinutes}–{matchedZone.estimatedMinutes + 15} min
              </div>
              <Button size="lg" fullWidth className="mt-2" onClick={handleContinue}>
                Start shopping
              </Button>
            </div>
          </Card>
        )}

        {step === 'out-of-zone' && (
          <Card className="shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-2xl bg-spice-50 flex items-center justify-center">
                  <MapPin className="text-spice-500" size={24} />
                </div>
                <h2 className="font-display text-xl font-semibold text-gray-900">Not quite there yet</h2>
                <p className="text-sm text-gray-500">
                  We don't deliver to <span className="font-medium">{enteredPostcode}</span> yet.
                  Leave your details and we'll let you know when we expand.
                </p>
              </div>

              <form onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)} className="flex flex-col gap-3" noValidate>
                <Input
                  label="Your name"
                  placeholder="Amara"
                  {...waitlistForm.register('name')}
                  error={waitlistForm.formState.errors.name?.message}
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="amara@example.com"
                  {...waitlistForm.register('email')}
                  error={waitlistForm.formState.errors.email?.message}
                />
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  variant="accent"
                  loading={waitlistForm.formState.isSubmitting}
                >
                  Join waitlist
                </Button>
              </form>
            </div>
          </Card>
        )}

        {step === 'waitlisted' && (
          <Card className="shadow-xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="text-brand-600" size={48} />
              <h2 className="font-display text-xl font-semibold text-gray-900">You're on the list!</h2>
              <p className="text-sm text-gray-500">
                We'll email you as soon as we deliver to your area.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
