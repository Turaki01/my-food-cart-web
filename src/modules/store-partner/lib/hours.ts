export type DayName = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'

export interface DayHours {
  day: DayName
  enabled: boolean
  open: string  // "HH:MM", 24h
  close: string // "HH:MM", 24h
}

export const DAY_ORDER: DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Date.getDay() is 0=Sun..6=Sat — index into this to get the matching DayName.
const DAY_BY_GET_DAY: DayName[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function defaultHours(): DayHours[] {
  return DAY_ORDER.map(day => ({ day, enabled: true, open: '09:00', close: '21:00' }))
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, '0')}${period}`
}

// Does not handle overnight windows (close time past midnight) — every store in
// this mock trades within a single day, so that's out of scope for now.
export function computeIsOpenFromHours(hours: DayHours[], now: Date = new Date()): boolean {
  const today = hours.find(h => h.day === DAY_BY_GET_DAY[now.getDay()])
  if (!today || !today.enabled) return false

  const minutesNow = now.getHours() * 60 + now.getMinutes()
  return minutesNow >= toMinutes(today.open) && minutesNow < toMinutes(today.close)
}

export function describeAvailability(hours: DayHours[], now: Date = new Date()): string {
  const today = hours.find(h => h.day === DAY_BY_GET_DAY[now.getDay()])
  if (!today || !today.enabled) return 'Closed today'

  const minutesNow = now.getHours() * 60 + now.getMinutes()
  if (minutesNow < toMinutes(today.open)) return `Opens today at ${formatTime(today.open)}`
  if (minutesNow >= toMinutes(today.close)) return 'Closed for today'
  return `Open until ${formatTime(today.close)}`
}
