import { NextResponse } from 'next/server'
import { authSignIn } from '@/helper/cognito'
import {
  authCookieNames,
  getRoleFromIdToken,
} from '@/lib/auth-token'

const refreshTokenMaxAge = 60 * 60 * 24 * 30

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string
    password?: string
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 },
    )
  }

  try {
    const tokens = await authSignIn(email, password)
    const response = NextResponse.json({ ok: true })
    const role = getRoleFromIdToken(tokens.idToken)

    response.cookies.set(
      authCookieNames.accessToken,
      tokens.accessToken,
      getCookieOptions(tokens.expiresIn),
    )
    response.cookies.set(
      authCookieNames.idToken,
      tokens.idToken,
      getCookieOptions(tokens.expiresIn),
    )
    response.cookies.set(
      authCookieNames.refreshToken,
      tokens.refreshToken,
      getCookieOptions(refreshTokenMaxAge),
    )
    response.cookies.set(
      authCookieNames.email,
      email,
      getCookieOptions(refreshTokenMaxAge),
    )
    response.cookies.set(
      authCookieNames.role,
      role,
      getCookieOptions(refreshTokenMaxAge),
    )

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
