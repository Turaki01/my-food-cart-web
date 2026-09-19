import { MOCK_STORES } from '@modules/customer/features/home/mock'
import { MOCK_PRODUCTS } from '@modules/customer/features/catalogue/mock'
import { MOCK_ORDERS } from '@modules/customer/features/orders/mock'

// The demo partner account owns store '1' (Mama Africa's Kitchen) — reusing the
// same seed data the customer app already uses keeps both sides of the demo
// consistent (same store, same products, same orders).
export const PARTNER_STORE_ID = '1'

export const PARTNER_STORE = MOCK_STORES.find(s => s.id === PARTNER_STORE_ID)!

export const PARTNER_PRODUCTS = MOCK_PRODUCTS[PARTNER_STORE_ID]

export const PARTNER_ORDERS = MOCK_ORDERS.filter(o => o.storeId === PARTNER_STORE_ID)
