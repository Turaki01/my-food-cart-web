import { cn } from '@shared/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'gray' | 'amber' | 'red' | 'outline'
}

export function Badge({ variant = 'outline', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-brand-50 text-brand-700': variant === 'green',
          'bg-gray-100 text-gray-600': variant === 'gray',
          'bg-amber-50 text-amber-700': variant === 'amber',
          'bg-red-50 text-red-600': variant === 'red',
          'border border-gray-200 text-gray-600': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
