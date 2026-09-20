import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\+44)(\d{4})(\d{6})/, '$1 $2 $3')
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
