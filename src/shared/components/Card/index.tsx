import { cn } from '@shared/lib/utils'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ className, padded = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[--paper-strong] rounded-xl border border-ink/10 shadow-sm',
        padded && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
