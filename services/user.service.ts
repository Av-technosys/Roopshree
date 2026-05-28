import {
  findUserByEmail,
  upsertUserFromAuthClaims,
  upsertUserProfileByEmail,
} from '@/repositories/user.repository'
import { cognitoUpdateUserAttribute } from '@/helper/cognito'
import type { ProfilePayload } from '@/validators/profile.validator'

export type ProfileView = {
  email: string
  fullName: string
  name: string
  phone: string
}

type SessionUser = {
  email?: string
  name?: string
  phone?: string
  sub?: string
} | null

type AuthClaims = {
  email?: string
  name?: string
  phone?: string
  sub?: string
}

function getCognitoPhoneNumber(phone: string) {
  const digits = phone.replace(/[^\d]/g, '')
  const withoutCountryCode =
    digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits

  return `+91${withoutCountryCode}`
}

export async function getProfileService(sessionUser: SessionUser) {
  if (!sessionUser?.email) {
    return null
  }

  const profile = await findUserByEmail(sessionUser.email)

  if (!profile) {
    const fallbackName = sessionUser.name || sessionUser.email.split('@')[0]

    return {
      email: sessionUser.email,
      fullName: fallbackName,
      name: fallbackName,
      phone: sessionUser.phone ?? '',
    } satisfies ProfileView
  }

  return {
    email: profile.email,
    fullName: profile.name,
    name: profile.name,
    phone: profile.phone ?? sessionUser.phone ?? '',
  } satisfies ProfileView
}

export async function updateProfileService(
  sessionUser: SessionUser,
  payload: ProfilePayload,
) {
  if (!sessionUser?.email) {
    throw new Error('Unauthorized')
  }

  await cognitoUpdateUserAttribute({
    email: sessionUser.email,
    userAttribute: [
      { Name: 'name', Value: payload.fullName },
      { Name: 'phone_number', Value: getCognitoPhoneNumber(payload.phone) },
    ],
  })

  const profile = await upsertUserProfileByEmail({
    email: sessionUser.email,
    cognitoSub: sessionUser.sub,
    payload,
  })

  return {
    email: sessionUser.email,
    fullName: profile?.name ?? payload.fullName,
    name: profile?.name ?? payload.fullName,
    phone: profile?.phone ?? payload.phone,
  } satisfies ProfileView
}

export async function syncProfileFromAuthClaimsService(claims: AuthClaims) {
  if (!claims.email || !claims.sub) return null

  return upsertUserFromAuthClaims({
    email: claims.email,
    cognitoSub: claims.sub,
    name: claims.name,
    phone: claims.phone,
  })
}
