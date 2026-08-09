import { cn } from '@shared/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ICON_SIZES = { sm: 28, md: 36, lg: 48 } as const
const TEXT_SIZES = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' } as const

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <BrandIcon size={ICON_SIZES[size]} />
      <span className={cn('font-semibold text-gray-900', TEXT_SIZES[size])}>
        My Food Cart
      </span>
    </div>
  )
}

export function BrandIcon({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="512" height="512" rx="96" fill="#1A6B3A" />
      <g
        transform="translate(256,256)"
        fill="none"
        stroke="white"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M-140,-80 L-100,-80 L-60,80 L100,80" />
        <path d="M-100,-80 L-80,20 L100,20" />
        <circle cx="-40" cy="110" r="18" fill="white" stroke="none" />
        <circle cx="80" cy="110" r="18" fill="white" stroke="none" />
        <path d="M40,-60 Q80,-100 120,-60 Q80,-20 40,-60Z" fill="#4bbd78" stroke="none" />
      </g>
    </svg>
  )
}
