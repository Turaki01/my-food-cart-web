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
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <div
          className={cn(
            'flex rounded-2xl border overflow-hidden transition-shadow duration-150',
            'focus-within:ring-2 focus-within:ring-brand-600 focus-within:border-transparent',
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
          )}
        >
          {/* Country code selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium text-gray-700 border-r border-gray-200 hover:bg-gray-50 focus:outline-none"
            >
              <span className="text-xl leading-none">{selected.flag}</span>
              <span className="text-sm">{selected.code}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {open && (
              <div className="absolute top-full left-0 z-50 mt-1 w-52 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                {COUNTRY_CODES.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCodeSelect(c.code)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50',
                      c.code === countryCode && 'bg-brand-50 text-brand-700 font-medium'
                    )}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="flex-1 text-left">{c.label}</span>
                    <span className="text-gray-400">{c.code}</span>
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
            className="flex-1 px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!error && (
          <p className="text-xs text-gray-400">
            We'll send a one-time code to verify your number
          </p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
