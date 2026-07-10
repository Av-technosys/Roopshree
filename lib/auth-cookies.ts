import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import {
  authCookieNames,
  getRefreshUsernameFromIdToken,
  getRoleFromIdToken,
} from '@/lib/auth-token'

export type CognitoTokenSet = {
  accessToken?: string
  idToken?: string
  refreshToken?: string
  expiresIn?: number
}

const refreshTokenMaxAge = 60 * 60 * 24 * 30

export function getAuthCookieOptions(maxAge: number): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}

export function assertCompleteTokenSet(tokens: CognitoTokenSet) {
  if (!tokens.accessToken || !tokens.idToken || !tokens.refreshToken) {
    throw new Error('Cognito did not return a complete token set')
  }

  return {
    accessToken: tokens.accessToken,
    idToken: tokens.idToken,
    refreshToken: tokens.refreshToken,
    expiresIn: tokens.expiresIn ?? 3600,
  }
}

export function getAuthCookiePayload({
  email,
  tokens,
}: {
  email: string
  tokens: ReturnType<typeof assertCompleteTokenSet>
}) {
  return [
    {
      name: authCookieNames.accessToken,
      value: tokens.accessToken,
      options: getAuthCookieOptions(tokens.expiresIn),
    },
    {
      name: authCookieNames.idToken,
      value: tokens.idToken,
      options: getAuthCookieOptions(tokens.expiresIn),
    },
    {
      name: authCookieNames.refreshToken,
      value: tokens.refreshToken,
      options: getAuthCookieOptions(refreshTokenMaxAge),
    },
    {
      name: authCookieNames.email,
      value: email,
      options: getAuthCookieOptions(refreshTokenMaxAge),
    },
    {
      name: authCookieNames.username,
      value: getRefreshUsernameFromIdToken(tokens.idToken, email),
      options: getAuthCookieOptions(refreshTokenMaxAge),
    },
    {
      name: authCookieNames.role,
      value: getRoleFromIdToken(tokens.idToken),
      options: getAuthCookieOptions(refreshTokenMaxAge),
    },
  ]
}

export function getClearAuthCookiePayload() {
  return Object.values(authCookieNames).map((name) => ({
    name,
    value: '',
    options: getAuthCookieOptions(0),
  }))
}
