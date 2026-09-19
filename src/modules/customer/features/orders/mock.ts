import type { Order } from '@shared/types'
import { MOCK_PRODUCTS } from '@modules/customer/features/catalogue/mock'
import { MOCK_STORES } from '@modules/customer/features/home/mock'

const store1 = MOCK_PRODUCTS['1']
const store2 = MOCK_PRODUCTS['2']

const find = (products: typeof store1, id: string) => {
  const product = products.find(p => p.id === id)
  if (!product) throw new Error(`Mock order references unknown product ${id}`)
  return product
}

const peckhamAddress = { id: 'addr-1', line1: '12 Rye Lane', postcode: 'SE15 4RH', area: 'Peckham' }

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o6',
    orderNumber: 'MFC-3QW9ZK',
    storeId: '1',
    storeName: MOCK_STORES[0].name,
    items: [
      { product: find(store1, 'p7'), quantity: 1 },
      { product: find(store1, 'p14'), quantity: 1 },
    ],
    deliveryAddress: peckhamAddress,
    deliverySlot: 'Today, 7–9pm',
    subtotal: 249 + 899,
    deliveryFee: 349,
    total: 249 + 899 + 349,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'o5',
    orderNumber: 'MFC-7YB4MX',
    storeId: '1',
    storeName: MOCK_STORES[0].name,
    items: [
      { product: find(store1, 'p4'), quantity: 2 },
      { product: find(store1, 'p12'), quantity: 1 },
    ],
    deliveryAddress: peckhamAddress,
    deliverySlot: 'Today, 5–7pm',
    subtotal: 249 * 2 + 1299,
    deliveryFee: 349,
    total: 249 * 2 + 1299 + 349,
    status: 'being_picked',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'o4',
    orderNumber: 'MFC-J8K2LP',
    storeId: '1',
    storeName: MOCK_STORES[0].name,
    items: [
      { product: find(store1, 'p10'), quantity: 1 },
      { product: find(store1, 'p11'), quantity: 1 },
      { product: find(store1, 'p14'), quantity: 1 },
    ],
    deliveryAddress: peckhamAddress,
    deliverySlot: 'Today, 5–7pm',
    subtotal: 899 + 749 + 899,
    deliveryFee: 349,
    total: 899 + 749 + 899 + 349,
    status: 'on_the_way',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'o3',
    orderNumber: 'MFC-9F3XQD',
    storeId: '1',
    storeName: MOCK_STORES[0].name,
    items: [
      { product: find(store1, 'p1'), quantity: 2 },
      { product: find(store1, 'p5'), quantity: 1 },
      { product: find(store1, 'p13'), quantity: 1 },
    ],
    deliveryAddress: peckhamAddress,
    deliverySlot: 'Today, 11am–1pm',
    subtotal: 299 * 2 + 199 + 499,
    deliveryFee: 349,
    total: 299 * 2 + 199 + 499 + 349,
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'o2',
    orderNumber: 'MFC-2H7RVN',
    storeId: '2',
    storeName: MOCK_STORES[1].name,
    items: [
      { product: find(store2, 'p20'), quantity: 1 },
      { product: find(store2, 'p21'), quantity: 2 },
    ],
    deliveryAddress: peckhamAddress,
    deliverySlot: 'Tomorrow, 1–3pm',
    subtotal: 349 + 299 * 2,
    deliveryFee: 349,
    total: 349 + 299 * 2 + 349,
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'o1',
    orderNumber: 'MFC-5T1WZC',
    storeId: '1',
    storeName: MOCK_STORES[0].name,
    items: [
      { product: find(store1, 'p2'), quantity: 1 },
      { product: find(store1, 'p6'), quantity: 3 },
      { product: find(store1, 'p8'), quantity: 1 },
      { product: find(store1, 'p15'), quantity: 1 },
    ],
    deliveryAddress: peckhamAddress,
    deliverySlot: 'Today, 5–7pm',
    subtotal: 349 + 129 * 3 + 279 + 399,
    deliveryFee: 349,
    total: 349 + 129 * 3 + 279 + 399 + 349,
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
]

export function getOrder(orderNumber: string): Order | undefined {
  return MOCK_ORDERS.find(o => o.orderNumber === orderNumber)
}
