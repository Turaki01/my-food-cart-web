import { cn } from '@shared/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'spice' | 'gray' | 'amber' | 'red' | 'outline'
}

export function Badge({ variant = 'outline', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold',
        {
          'bg-brand-50 text-brand-700': variant === 'green',
          'bg-spice-50 text-spice-700': variant === 'spice',
          'bg-gray-100 text-gray-600': variant === 'gray',
          'bg-amber-50 text-amber-700': variant === 'amber',
          'bg-red-50 text-red-600': variant === 'red',
          'border border-ink/15 text-ink/70': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
