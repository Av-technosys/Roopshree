export const authCookieNames = {
  accessToken: 'rs_access_token',
  idToken: 'rs_id_token',
  refreshToken: 'rs_refresh_token',
  email: 'rs_auth_email',
  username: 'rs_auth_username',
  role: 'rs_auth_role',
} as const

export type AuthRole = 'user' | 'admin'

type CognitoClaims = {
  email?: string
  name?: string
  phone_number?: string
  sub?: string
  'cognito:username'?: string
  'custom:role'?: string
  'cognito:groups'?: string[]
}

export function decodeJwtPayload<TClaims>(token: string): TClaims | null {
  try {
    const [, payload] = token.split('.')

    if (!payload) {
      return null
    }

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TClaims
  } catch {
    return null
  }
}

export function getRoleFromIdToken(idToken: string): AuthRole {
  const claims = decodeJwtPayload<CognitoClaims>(idToken)

  if (
    claims?.['custom:role'] === 'admin' ||
    claims?.['cognito:groups']?.includes('admin')
  ) {
    return 'admin'
  }

  return 'user'
}

export function getEmailFromIdToken(idToken: string) {
  return decodeJwtPayload<CognitoClaims>(idToken)?.email
}

export function getUserClaimsFromIdToken(idToken: string) {
  const claims = decodeJwtPayload<CognitoClaims>(idToken)

  return {
    email: claims?.email,
    name: claims?.name,
    phone: claims?.phone_number,
    sub: claims?.sub,
    username: claims?.['cognito:username'],
  }
}

export function getRefreshUsernameFromIdToken(idToken: string, fallbackEmail: string) {
  const claims = decodeJwtPayload<CognitoClaims>(idToken)

  return claims?.['cognito:username'] ?? claims?.sub ?? fallbackEmail
}
