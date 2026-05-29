import { cookies } from 'next/headers'
import { refreshCognitoTokens } from '@/helper/cognito'
import { getAuthCookiePayload } from '@/lib/auth-cookies'
import { authCookieNames, decodeJwtPayload } from '@/lib/auth-token'

type JwtExpiryClaims = {
  exp?: number
}

function isTokenExpired(token?: string) {
  if (!token) {
    return true
  }

  const exp = decodeJwtPayload<JwtExpiryClaims>(token)?.exp

  if (!exp) {
    return true
  }

  return Date.now() >= exp * 1000 - 60_000
}

export async function getValidAccessToken() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value

  if (!isTokenExpired(accessToken)) {
    return accessToken
  }

  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value
  const email = cookieStore.get(authCookieNames.email)?.value

  if (!refreshToken || !email) {
    throw new Error('Unauthorized')
  }

  const refreshedTokens = await refreshCognitoTokens({ email, refreshToken })

  if (!refreshedTokens.accessToken || !refreshedTokens.idToken) {
    throw new Error('Unable to refresh session')
  }

  const tokens = {
    accessToken: refreshedTokens.accessToken,
    idToken: refreshedTokens.idToken,
    refreshToken: refreshedTokens.refreshToken ?? refreshToken,
    expiresIn: refreshedTokens.expiresIn ?? 3600,
  }

  getAuthCookiePayload({ email, tokens }).forEach((cookie) => {
    cookieStore.set(cookie.name, cookie.value, cookie.options)
  })

  return tokens.accessToken
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const accessToken = await getValidAccessToken()
  const headers = new Headers(init.headers)

  headers.set('Authorization', `Bearer ${accessToken}`)

  return fetch(input, {
    ...init,
    headers,
  })
}
