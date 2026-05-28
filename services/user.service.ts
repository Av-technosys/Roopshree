import { findUserByEmail } from '@/repositories/user.repository'

export async function getProfileService(sessionUser: { email?: string } | null) {
  if (!sessionUser?.email) {
    return null
  }

  const profile = await findUserByEmail(sessionUser.email)

  if (!profile) {
    const fallbackName = sessionUser.email.split('@')[0]

    return {
      email: sessionUser.email,
      fullName: fallbackName,
      name: fallbackName,
    }
  }

  return {
    ...profile,
    fullName: profile.name,
  }
}
