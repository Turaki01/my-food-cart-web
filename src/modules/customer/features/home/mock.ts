import type { Store } from '@shared/types'

export interface MockStore extends Store {
  coverGradient: string
}

export const MOCK_STORES: MockStore[] = [
  {
    id: '1',
    name: "Mama Africa's Kitchen",
    area: 'Rye Lane, Peckham',
    categoryTags: ['West African', 'Fresh Produce', 'Frozen'],
    estimatedDeliveryMin: 45,
    estimatedDeliveryMax: 60,
    minimumOrderValue: 2000,
    isOpen: true,
    coverGradient: 'from-orange-400 to-red-500',
  },
  {
    id: '2',
    name: 'Afro Foods Direct',
    area: 'Atlantic Road, Brixton',
    categoryTags: ['Caribbean', 'Condiments', 'Grains & Staples'],
    estimatedDeliveryMin: 50,
    estimatedDeliveryMax: 65,
    minimumOrderValue: 2500,
    isOpen: true,
    coverGradient: 'from-purple-500 to-indigo-600',
  },
  {
    id: '3',
    name: 'West African Groceries',
    area: 'Clapham Road, Stockwell',
    categoryTags: ['West African', 'Spices', 'Frozen'],
    estimatedDeliveryMin: 50,
    estimatedDeliveryMax: 70,
    minimumOrderValue: 2000,
    isOpen: false,
    coverGradient: 'from-emerald-400 to-green-700',
  },
  {
    id: '4',
    name: 'Ghana Market',
    area: 'Lewisham High Street',
    categoryTags: ['Ghanaian', 'Fresh Produce', 'Fish & Seafood'],
    estimatedDeliveryMin: 55,
    estimatedDeliveryMax: 75,
    minimumOrderValue: 3000,
    isOpen: true,
    coverGradient: 'from-amber-400 to-yellow-600',
  },
]
