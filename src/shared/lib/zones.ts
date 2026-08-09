import type { DeliveryZone } from '@shared/types'

const DELIVERY_ZONES: DeliveryZone[] = [
  { key: 'peckham',   name: 'Peckham',    postcodes: ['SE15'],        estimatedMinutes: 45 },
  { key: 'brixton',   name: 'Brixton',    postcodes: ['SW2', 'SW9'],  estimatedMinutes: 50 },
  { key: 'lewisham',  name: 'Lewisham',   postcodes: ['SE13', 'SE4', 'SE6'], estimatedMinutes: 55 },
  { key: 'stockwell', name: 'Stockwell',  postcodes: ['SW8'],         estimatedMinutes: 50 },
  { key: 'woolwich',  name: 'Woolwich',   postcodes: ['SE18', 'SE28'], estimatedMinutes: 60 },
]

export interface ZoneCheckResult {
  inZone: boolean
  zone?: DeliveryZone
}

export function checkDeliveryZone(postcode: string): ZoneCheckResult {
  const district = postcode.toUpperCase().replace(/\s/g, '').match(/^[A-Z]{1,2}\d{1,2}/)?.[0]
  if (!district) return { inZone: false }

  const zone = DELIVERY_ZONES.find(z =>
    z.postcodes.some(p => district === p || district.startsWith(p))
  )

  return zone ? { inZone: true, zone } : { inZone: false }
}

export { DELIVERY_ZONES }
