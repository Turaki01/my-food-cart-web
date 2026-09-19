import { cn } from '@shared/lib/utils'
import { useRef } from 'react'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: boolean
}

export function OTPInput({ value = '', onChange, length = 6, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const focus = (index: number) => inputRefs.current[index]?.focus()

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return
    const next = [...digits]
    next[index] = char
    onChange(next.join(''))
    if (char && index < length - 1) focus(index + 1)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        onChange(next.join(''))
      } else if (index > 0) {
        const next = [...digits]
        next[index - 1] = ''
        onChange(next.join(''))
        focus(index - 1)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focus(index - 1)
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focus(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    focus(Math.min(pasted.length, length - 1))
  }

  return (
    <div className="flex gap-3" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoFocus={i === 0}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            'w-12 h-14 rounded-lg border text-center text-xl font-display font-semibold text-ink bg-white shadow-sm',
            'focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-colors duration-150',
            digit ? 'border-brand-600' : 'border-ink/15',
            error && 'border-red-400 ring-2 ring-red-500/20 shake'
          )}
        />
      ))}
    </div>
  )
}
