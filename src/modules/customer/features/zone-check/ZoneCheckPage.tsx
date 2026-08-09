import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, MapPin, Clock } from 'lucide-react'
import { Logo } from '@shared/components/Logo'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Card } from '@shared/components/Card'
import { useAuthStore } from '@shared/stores/auth.store'
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
  const setZoneCheckComplete = useAuthStore(s => s.setZoneCheckComplete)
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
    setZoneCheckComplete(matchedZone?.name ?? 'South London')
    navigate('/customer/home', { replace: true })
  }

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm space-y-4">
        <Logo size="md" className="justify-center mb-2" />

        {step === 'postcode' && (
          <Card>
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                <MapPin className="text-brand-600" size={24} />
              </div>
              <h1 className="text-base font-semibold text-gray-900">Where do you live?</h1>
              <p className="text-sm text-gray-500 text-center">
                We currently deliver to select areas in South London
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
          </Card>
        )}

        {step === 'in-zone' && matchedZone && (
          <Card>
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="text-brand-600" size={48} />
              <h2 className="text-base font-semibold text-gray-900">Great news!</h2>
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
          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <MapPin className="text-amber-500" size={24} />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Not quite there yet</h2>
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
                  loading={waitlistForm.formState.isSubmitting}
                >
                  Join waitlist
                </Button>
              </form>
            </div>
          </Card>
        )}

        {step === 'waitlisted' && (
          <Card>
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="text-brand-600" size={48} />
              <h2 className="text-base font-semibold text-gray-900">You're on the list!</h2>
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
