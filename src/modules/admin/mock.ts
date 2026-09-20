import type { UserRole } from '@shared/types'

export interface AdminUserRecord {
  id: string
  name: string
  contact: string
  role: UserRole
  joinedAt: string
  status: 'active' | 'suspended'
}

// Synthetic — the app's mock auth only supports one demo account per role
// (see auth.store.ts / api.ts), so there's no real multi-user list behind
// this. Gives the admin directory something real to filter/search/suspend.
export const MOCK_USERS: AdminUserRecord[] = [
  { id: 'u1', name: 'Amara Okafor', contact: '+44 7700 900111', role: 'customer', joinedAt: daysAgo(2), status: 'active' },
  { id: 'u2', name: 'Chidi Okoye', contact: '+44 7700 900222', role: 'customer', joinedAt: daysAgo(6), status: 'active' },
  { id: 'u3', name: 'Grace Mensah', contact: '+44 7700 900333', role: 'customer', joinedAt: daysAgo(14), status: 'active' },
  { id: 'u4', name: 'Tunde Bello', contact: '+44 7700 900444', role: 'customer', joinedAt: daysAgo(30), status: 'suspended' },
  { id: 'u5', name: "Mama Africa's Kitchen", contact: 'owner@mamaafricaskitchen.com', role: 'store_partner', joinedAt: daysAgo(90), status: 'active' },
  { id: 'u6', name: 'Afro Foods Direct', contact: 'hello@afrofoodsdirect.com', role: 'store_partner', joinedAt: daysAgo(60), status: 'active' },
  { id: 'u7', name: 'Kwame Asante', contact: 'kwame@myfoodcart.co.uk', role: 'ops', joinedAt: daysAgo(120), status: 'active' },
  { id: 'u8', name: 'Ngozi Eze', contact: 'ngozi@myfoodcart.co.uk', role: 'ops', joinedAt: daysAgo(45), status: 'active' },
]

function daysAgo(n: number): string {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString()
}
