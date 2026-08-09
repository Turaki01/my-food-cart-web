import { cn } from '@shared/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-2 border-gray-200 border-t-brand-600 animate-spin',
        { 'h-4 w-4': size === 'sm', 'h-6 w-6': size === 'md', 'h-10 w-10': size === 'lg' },
        className
      )}
    />
  )
}
