import type { User, UserRole } from '@shared/types'

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function sendOTP(phone: string): Promise<void> {
  // TODO: POST /api/auth/send-otp  { phone }
  console.log('[api] sendOTP', phone)
  await delay(800)
}

export async function verifyOTP(
  phone: string,
  token: string
): Promise<{ user: User; isNewUser: boolean }> {
  // TODO: POST /api/auth/verify-otp  { phone, token }
  console.log('[api] verifyOTP', phone, token)
  await delay(800)

  return {
    user: { id: 'mock-id', phone, role: 'customer' as UserRole, createdAt: new Date().toISOString() },
    isNewUser: true,
  }
}

export async function signOut(): Promise<void> {
  // TODO: POST /api/auth/sign-out
  console.log('[api] signOut')
}

// ─── Store partner auth ─────────────────────────────────────────────────────

export async function loginPartner(email: string, _password: string): Promise<{ user: User }> {
  // TODO: POST /api/partner/login  { email, password }
  console.log('[api] loginPartner', email)
  await delay(800)

  return {
    user: {
      id: 'mock-partner-id',
      phone: '',
      email,
      name: "Mama Africa's Kitchen",
      role: 'store_partner' as UserRole,
      createdAt: new Date().toISOString(),
    },
  }
}

// ─── Ops dispatch auth ──────────────────────────────────────────────────────

export async function loginOps(email: string, _password: string): Promise<{ user: User }> {
  // TODO: POST /api/ops/login  { email, password }
  console.log('[api] loginOps', email)
  await delay(800)

  return {
    user: {
      id: 'mock-ops-id',
      phone: '',
      email,
      name: 'Dispatch',
      role: 'ops' as UserRole,
      createdAt: new Date().toISOString(),
    },
  }
}

// ─── Admin auth ─────────────────────────────────────────────────────────────

export async function loginAdmin(email: string, _password: string): Promise<{ user: User }> {
  // TODO: POST /api/admin/login  { email, password }
  console.log('[api] loginAdmin', email)
  await delay(800)

  return {
    user: {
      id: 'mock-admin-id',
      phone: '',
      email,
      name: 'Admin',
      role: 'admin' as UserRole,
      createdAt: new Date().toISOString(),
    },
  }
}

// ─── Waitlist ───────────────────────────────────────────────────────────────

export async function joinWaitlist(data: { name: string; email: string; postcode: string }): Promise<void> {
  // TODO: POST /api/waitlist  { name, email, postcode }
  console.log('[api] joinWaitlist', data)
  await delay(600)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
