import { cn } from '@shared/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[--paper] disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800': variant === 'primary',
          'border border-ink/15 bg-white text-ink shadow-sm hover:bg-gray-50 active:bg-gray-100': variant === 'secondary',
          'bg-spice-600 text-white shadow-sm hover:bg-spice-700 active:bg-spice-800': variant === 'accent',
          'text-ink/60 hover:text-ink hover:bg-ink/5': variant === 'ghost',
          'border border-red-600/25 text-red-600 hover:bg-red-50': variant === 'danger',
          'text-sm px-4 py-2.5': size === 'sm',
          'text-base px-5 py-3': size === 'md',
          'text-lg px-6 py-4': size === 'lg',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
