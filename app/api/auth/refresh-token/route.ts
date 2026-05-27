import { NextResponse } from 'next/server'
import { refreshCognitoTokens } from '@/helper/cognito'
import { authCookieNames, getRoleFromIdToken } from '@/lib/auth-token'

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
  const refreshToken = request.headers
    .get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${authCookieNames.refreshToken}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  const email = request.headers
    .get('cookie')
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${authCookieNames.email}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  if (!refreshToken || !email) {
    return NextResponse.json(
      { error: 'Refresh token is missing' },
      { status: 401 },
    )
  }

  const tokens = await refreshCognitoTokens(
    decodeURIComponent(refreshToken),
    decodeURIComponent(email),
  )
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
    tokens.refreshToken ?? decodeURIComponent(refreshToken),
    getCookieOptions(refreshTokenMaxAge),
  )
  response.cookies.set(
    authCookieNames.role,
    role,
    getCookieOptions(refreshTokenMaxAge),
  )

  return response
}
