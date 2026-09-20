import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_USERS, type AdminUserRecord } from '@modules/admin/mock'

interface AdminUsersState {
  users: AdminUserRecord[]
  toggleStatus: (userId: string) => void
}

export const useAdminUsersStore = create<AdminUsersState>()(
  persist(
    (set, get) => ({
      users: MOCK_USERS,
      toggleStatus: (userId) =>
        set({
          users: get().users.map(u =>
            u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
          ),
        }),
    }),
    { name: 'mfc-admin-users' }
  )
)
