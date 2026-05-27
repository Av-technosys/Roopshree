import { cookies } from 'next/headers'
import { authCookieNames, getEmailFromIdToken } from '@/lib/auth-token'

export async function getCurrentSession() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value
  const idToken = cookieStore.get(authCookieNames.idToken)?.value
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value
  const role = cookieStore.get(authCookieNames.role)?.value

  if (!refreshToken) {
    return null
  }

  return {
    accessToken,
    idToken,
    refreshToken,
    user: {
      email: idToken ? getEmailFromIdToken(idToken) : undefined,
      role,
    },
  }
}

export async function getCurrentUser() {
  const session = await getCurrentSession()

  return session?.user ?? null
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function requireAdmin() {
  const session = await getCurrentSession()
  const user = await requireUser()
  const role = session?.user?.role

  if (role !== 'admin') {
    throw new Error('Forbidden')
  }

  return user
}
