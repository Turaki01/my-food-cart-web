import { MOCK_STORES } from '@modules/customer/features/home/mock'
import { MOCK_PRODUCTS } from '@modules/customer/features/catalogue/mock'

// The demo partner account owns store '1' (Mama Africa's Kitchen) — reusing the
// same seed data the customer app already uses keeps both sides of the demo
// consistent (same store, same products). Orders live in the shared
// `useOrdersStore` (see shared/stores/orders.store.ts) so placing an order as a
// customer, advancing it as this partner, and delivering it as ops all operate
// on the same records instead of three disconnected copies.
export const PARTNER_STORE_ID = '1'

export const PARTNER_STORE = MOCK_STORES.find(s => s.id === PARTNER_STORE_ID)!

export const PARTNER_PRODUCTS = MOCK_PRODUCTS[PARTNER_STORE_ID]
