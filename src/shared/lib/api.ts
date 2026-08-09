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
