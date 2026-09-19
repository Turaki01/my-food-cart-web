import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Logo } from '@shared/components/Logo'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Card } from '@shared/components/Card'
import { useLocationStore } from '@shared/stores/location.store'
import { checkDeliveryZone } from '@shared/lib/zones'
import { DELIVERY_ZONES } from '@shared/lib/zones'
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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[--paper] px-5 py-10">
      <Logo size="md" className="mb-7 justify-center" />

      {step === 'postcode' && (
        <Card className="w-full max-w-sm p-8">
          <div className="mb-7 text-center">
            <p className="section-kicker text-[11px] font-semibold text-ink/45">
              Live in South London — expanding across London
            </p>
            <h1 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">
              Where should we deliver?
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink/55">
              Check which African and Caribbean stores are delivering to your postcode today.
            </p>
          </div>

          <form onSubmit={postcodeForm.handleSubmit(handlePostcodeSubmit)} className="flex flex-col gap-6" noValidate>
            <Input
              label="Your postcode"
              placeholder="SE15 4RH"
              {...postcodeForm.register('postcode')}
              error={postcodeForm.formState.errors.postcode?.message}
            />
            <Button type="submit" size="lg" fullWidth loading={postcodeForm.formState.isSubmitting}>
              Check delivery
            </Button>
          </form>

          <div className="mt-7 border-t border-ink/10 pt-5 text-center">
            <p className="text-xs text-ink/40">
              Currently live in {DELIVERY_ZONES.map(z => z.name).join(', ')}
            </p>
          </div>
        </Card>
      )}

      {step === 'in-zone' && matchedZone && (
        <Card className="w-full max-w-sm p-8 text-center">
          <p className="section-kicker text-[11px] font-semibold text-brand-700">Available now</p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Great news</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">
            We deliver to <span className="font-semibold text-ink">{matchedZone.name}</span>.
          </p>

          <dl className="mt-6 flex items-baseline justify-center gap-2 border-y border-ink/10 py-5">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink/40">Estimated delivery</dt>
            <dd className="tabular font-display text-xl font-medium text-ink">
              {matchedZone.estimatedMinutes}–{matchedZone.estimatedMinutes + 15} min
            </dd>
          </dl>

          <Button size="lg" fullWidth className="mt-6" onClick={handleContinue}>
            Start shopping
          </Button>
        </Card>
      )}

      {step === 'out-of-zone' && (
        <Card className="w-full max-w-sm p-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-medium tracking-[-0.01em] text-ink">Not quite there yet</h2>
            <p className="mt-2 text-sm leading-6 text-ink/55">
              We don&apos;t deliver to <span className="font-semibold text-ink">{enteredPostcode}</span> yet
              — we&apos;re live across South London first and expanding to the rest of London next.
              Leave your details and we&apos;ll let you know the moment we reach you.
            </p>
          </div>

          <form onSubmit={waitlistForm.handleSubmit(handleWaitlistSubmit)} className="mt-6 flex flex-col gap-5" noValidate>
            <Input
              label="Your name"
              placeholder="Enter name"
              {...waitlistForm.register('name')}
              error={waitlistForm.formState.errors.name?.message}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="Enter email"
              {...waitlistForm.register('email')}
              error={waitlistForm.formState.errors.email?.message}
            />
            <Button type="submit" size="lg" fullWidth loading={waitlistForm.formState.isSubmitting}>
              Join waitlist
            </Button>
          </form>
        </Card>
      )}

      {step === 'waitlisted' && (
        <Card className="w-full max-w-sm p-8 text-center">
          <p className="section-kicker text-[11px] font-semibold text-brand-700">You&apos;re on the list</p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.01em] text-ink">Thank you</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">
            We&apos;ll email you as soon as delivery opens up in your area.
          </p>
        </Card>
      )}
    </div>
  )
}
