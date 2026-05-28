'use server'

import { cookies } from 'next/headers'
import {
  authSignIn,
  cognitoConfirmForgotPassword,
  cognitoConfirmSignUp,
  cognitoForgotPassword,
  cognitoSignUp,
} from '@/helper/cognito'
import {
  assertCompleteTokenSet,
  getAuthCookiePayload,
  getClearAuthCookiePayload,
} from '@/lib/auth-cookies'
import { getUserClaimsFromIdToken } from '@/lib/auth-token'
import { syncProfileFromAuthClaimsService } from '@/services/user.service'

type AuthActionResult = {
  ok: boolean
  error?: string
}

async function setAuthCookies(email: string, password: string) {
  const cookieStore = await cookies()
  const tokens = assertCompleteTokenSet(await authSignIn({ email, password }))

  getAuthCookiePayload({ email, tokens }).forEach((cookie) => {
    cookieStore.set(cookie.name, cookie.value, cookie.options)
  })

  try {
    await syncProfileFromAuthClaimsService(getUserClaimsFromIdToken(tokens.idToken))
  } catch (error) {
    console.error('Unable to sync signed-in user profile:', error)
  }
}

export async function signInAction({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthActionResult> {
  if (!email || !password) {
    return { ok: false, error: 'Email and password are required' }
  }

  try {
    await setAuthCookies(email, password)

    return { ok: true }
  } catch {
    return { ok: false, error: 'Invalid email or password' }
  }
}

export async function signUpAction({
  name,
  email,
  phone,
  password,
}: {
  name: string
  email: string
  phone: string
  password: string
}): Promise<AuthActionResult> {
  if (!name || !email || !phone || !password) {
    return { ok: false, error: 'Name, email, phone and password are required' }
  }

  try {
    await cognitoSignUp({
      email,
      password,
      userAttribute: [
        { Name: 'name', Value: name },
        { Name: 'email', Value: email },
        { Name: 'phone_number', Value: phone },
      ],
    })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Unable to create account' }
  }
}

export async function confirmSignUpAction({
  email,
  code,
  password,
}: {
  email: string
  code: string
  password: string
}): Promise<AuthActionResult> {
  if (!email || !code || !password) {
    return { ok: false, error: 'Email, OTP and password are required' }
  }

  try {
    await cognitoConfirmSignUp({ email, code })
    await setAuthCookies(email, password)

    return { ok: true }
  } catch {
    return { ok: false, error: 'Unable to verify account' }
  }
}

export async function forgotPasswordAction({
  email,
}: {
  email: string
}): Promise<AuthActionResult> {
  if (!email) {
    return { ok: false, error: 'Email is required' }
  }

  try {
    await cognitoForgotPassword({ email })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Unable to send OTP' }
  }
}

export async function confirmForgotPasswordAction({
  email,
  code,
  newPassword,
}: {
  email: string
  code: string
  newPassword: string
}): Promise<AuthActionResult> {
  if (!email || !code || !newPassword) {
    return { ok: false, error: 'Email, OTP and new password are required' }
  }

  try {
    await cognitoConfirmForgotPassword({ email, code, newPassword })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Unable to update password' }
  }
}

export async function signOutAction(): Promise<AuthActionResult> {
  const cookieStore = await cookies()

  getClearAuthCookiePayload().forEach((cookie) => {
    cookieStore.set(cookie.name, cookie.value, cookie.options)
  })

  return { ok: true }
}
