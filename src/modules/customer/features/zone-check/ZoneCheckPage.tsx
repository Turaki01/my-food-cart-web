import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Clock3, MapPin } from 'lucide-react'
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
    <div className="relative min-h-[100dvh] overflow-hidden bg-transparent px-5 py-10">
      <div className="pointer-events-none absolute left-[-12rem] top-16 h-72 w-72 rounded-full bg-brand-50 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-8 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-50/70 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-5 flex items-center justify-center gap-3">
            <BrandIcon size={40} />
            <span className="text-[2rem] font-extrabold tracking-[-0.05em] text-slate-900">My Food Cart</span>
          </div>

          {step === 'postcode' && (
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.18)] md:p-7">
              <div className="mb-6 flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-brand-50">
                  <MapPin className="text-brand-600" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-[-0.05em] text-slate-950">
                    Where should we deliver?
                  </h1>
                  <p className="mt-3 text-base leading-8 text-slate-500">
                    Check which African and Caribbean stores are delivering to your postcode today.
                  </p>
                </div>
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
                  className="rounded-2xl"
                >
                  Check delivery
                </Button>
              </form>
            </Card>
          )}

          {step === 'in-zone' && matchedZone && (
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-[0_28px_60px_-40px_rgba(15,23,42,0.18)] md:p-7">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-brand-50">
                  <CheckCircle2 className="text-brand-600" size={34} />
                </div>
                <div>
                  <p className="section-kicker text-[11px] font-bold text-brand-600">Available now</p>
                  <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-slate-950">Great news</h2>
                  <p className="mt-3 text-base leading-8 text-slate-500">
                    We deliver to <span className="font-semibold text-brand-700">{matchedZone.name}</span>.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
                  <Clock3 size={16} />
                  Estimated delivery: {matchedZone.estimatedMinutes}-{matchedZone.estimatedMinutes + 15} min
                </div>
                <Button size="lg" fullWidth className="mt-2 rounded-2xl" onClick={handleContinue}>
                  Start shopping
                </Button>
              </div>
            </Card>
          )}

          {step === 'out-of-zone' && (
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.18)] md:p-7">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-100">
                    <MapPin className="text-slate-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-slate-950">Not quite there yet</h2>
                    <p className="mt-3 text-base leading-8 text-slate-500">
                      We don&apos;t deliver to <span className="font-semibold text-slate-700">{enteredPostcode}</span> yet.
                      Leave your details and we&apos;ll let you know when we expand.
                    </p>
                  </div>
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
                    className="rounded-2xl"
                  >
                    Join waitlist
                  </Button>
                </form>
              </div>
            </Card>
          )}

          {step === 'waitlisted' && (
            <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-[0_28px_60px_-40px_rgba(15,23,42,0.18)] md:p-7">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-brand-50">
                  <CheckCircle2 className="text-brand-600" size={34} />
                </div>
                <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-slate-950">You&apos;re on the list</h2>
                <p className="text-base leading-8 text-slate-500">
                  We&apos;ll email you as soon as delivery opens up in your area.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
