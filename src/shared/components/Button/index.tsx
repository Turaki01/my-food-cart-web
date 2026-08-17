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
        'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-brand-600 text-white shadow-sm shadow-brand-900/10 hover:bg-brand-700 hover:shadow-md active:scale-[0.98]': variant === 'primary',
          'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100': variant === 'secondary',
          'bg-spice-500 text-white shadow-sm shadow-spice-900/10 hover:bg-spice-600 hover:shadow-md active:scale-[0.98]': variant === 'accent',
          'text-brand-700 hover:bg-brand-50': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
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
