export type UserRole = 'customer' | 'store_partner' | 'ops'

export interface User {
  id: string
  phone: string
  role: UserRole
  name?: string
  email?: string
  createdAt: string
}

export interface DeliveryAddress {
  id: string
  label?: string
  line1: string
  line2?: string
  postcode: string
  area: string
}

export interface Store {
  id: string
  name: string
  area: string
  categoryTags: string[]
  estimatedDeliveryMin: number
  estimatedDeliveryMax: number
  minimumOrderValue: number
  isOpen: boolean
  imageUrl?: string
}

export interface Product {
  id: string
  storeId: string
  name: string
  price: number
  unit: string
  category: string
  imageUrl?: string
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  storeId: string
  storeName: string
  items: CartItem[]
}

export type OrderStatus = 'confirmed' | 'being_picked' | 'on_the_way' | 'delivered'

export interface Order {
  id: string
  orderNumber: string
  storeId: string
  storeName: string
  items: CartItem[]
  deliveryAddress: DeliveryAddress
  deliverySlot: string
  deliveryNote?: string
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  createdAt: string
}

export interface DeliveryZone {
  key: string
  name: string
  postcodes: string[]
  estimatedMinutes: number
}
