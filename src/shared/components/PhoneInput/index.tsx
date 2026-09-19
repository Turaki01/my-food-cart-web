import { cn } from '@shared/lib/utils'
import { ChevronDown } from 'lucide-react'
import { forwardRef, useState } from 'react'

const COUNTRY_CODES = [
  { code: '+44',  flag: '🇬🇧', label: 'UK' },
  { code: '+234', flag: '🇳🇬', label: 'Nigeria' },
  { code: '+233', flag: '🇬🇭', label: 'Ghana' },
  { code: '+27',  flag: '🇿🇦', label: 'South Africa' },
  { code: '+225', flag: '🇨🇮', label: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', label: 'Senegal' },
  { code: '+254', flag: '🇰🇪', label: 'Kenya' },
  { code: '+1',   flag: '🇺🇸', label: 'US / Canada' },
]

interface PhoneInputProps {
  onChange?: (e14Phone: string) => void
  error?: string
  label?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, error, label = 'Phone number' }, ref) => {
    const [countryCode, setCountryCode] = useState('+44')
    const [open, setOpen] = useState(false)
    const [local, setLocal] = useState('')

    const selected = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0]

    const handleLocalChange = (raw: string) => {
      const digits = raw.replace(/\D/g, '')
      setLocal(digits)
      // Strip leading 0 for E.164 formatting
      const normalized = digits.startsWith('0') ? digits.slice(1) : digits
      onChange?.(`${countryCode}${normalized}`)
    }

    const handleCodeSelect = (code: string) => {
      setCountryCode(code)
      setOpen(false)
      const normalized = local.startsWith('0') ? local.slice(1) : local
      onChange?.(`${code}${normalized}`)
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-ink/70">{label}</label>}
        <div
          className={cn(
            'flex rounded-lg border overflow-hidden bg-white transition-colors duration-150',
            'focus-within:ring-2 focus-within:ring-offset-0',
            error ? 'border-red-400 focus-within:ring-red-500/25' : 'border-ink/15 focus-within:border-brand-600 focus-within:ring-brand-600/20'
          )}
        >
          {/* Country code selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium text-ink border-r border-ink/10 hover:bg-ink/5 focus:outline-none"
            >
              <span className="text-xl leading-none">{selected.flag}</span>
              <span className="text-sm">{selected.code}</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
            </button>

            {open && (
              <div className="absolute top-full left-0 z-50 mt-1 w-52 rounded-lg border border-ink/10 bg-white shadow-lg overflow-hidden">
                {COUNTRY_CODES.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCodeSelect(c.code)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50',
                      c.code === countryCode && 'bg-brand-50 text-brand-700 font-semibold'
                    )}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="flex-1 text-left">{c.label}</span>
                    <span className="text-ink/40">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number field */}
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            placeholder="7700 900 000"
            value={local}
            onChange={e => handleLocalChange(e.target.value)}
            className="flex-1 px-4 py-3.5 text-base text-ink placeholder:text-ink/35 bg-transparent focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!error && (
          <p className="text-xs text-ink/40">
            We'll send a one-time code to verify your number
          </p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
