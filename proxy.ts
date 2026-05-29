import { NextResponse, type NextRequest } from 'next/server'

const authCookieNames = {
  accessToken: 'rs_access_token',
  idToken: 'rs_id_token',
  refreshToken: 'rs_refresh_token',
  email: 'rs_auth_email',
  role: 'rs_auth_role',
} as const

type JwtClaims = {
  exp?: number
  'custom:role'?: string
  'cognito:groups'?: string[]
}

type CognitoRefreshResponse = {
  AuthenticationResult?: {
    AccessToken?: string
    IdToken?: string
    RefreshToken?: string
    ExpiresIn?: number
  }
}

const refreshTokenMaxAge = 60 * 60 * 24 * 30
const refreshSkewMs = 60_000

function getAuthCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

function decodeJwtPayload<TClaims>(token?: string): TClaims | null {
  try {
    const payload = token?.split('.')[1]

    if (!payload) return null

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    )

    return JSON.parse(atob(paddedPayload)) as TClaims
  } catch {
    return null
  }
}

function isTokenExpired(token?: string) {
  const exp = decodeJwtPayload<JwtClaims>(token)?.exp

  if (!exp) return true

  return Date.now() >= exp * 1000 - refreshSkewMs
}

function getRoleFromIdToken(idToken: string) {
  const claims = decodeJwtPayload<JwtClaims>(idToken)

  if (
    claims?.['custom:role'] === 'admin' ||
    claims?.['cognito:groups']?.includes('admin')
  ) {
    return 'admin'
  }

  return 'user'
}

async function generateSecretHash(username: string) {
  const encoder = new TextEncoder()
  const clientId = getRequiredEnv('COGNITO_CLIENT_ID')
  const clientSecret = getRequiredEnv('COGNITO_CLIENT_SECRET')
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(clientSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${username}${clientId}`),
  )

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function refreshCognitoSession({
  email,
  refreshToken,
}: {
  email: string
  refreshToken: string
}) {
  const region = getRequiredEnv('AWS_REGION')
  const clientId = getRequiredEnv('COGNITO_CLIENT_ID')

  const response = await fetch(
    `https://cognito-idp.${region}.amazonaws.com/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email,
          REFRESH_TOKEN: refreshToken,
          SECRET_HASH: await generateSecretHash(email),
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error('Unable to refresh Cognito session')
  }

  const data = (await response.json()) as CognitoRefreshResponse
  const tokens = data.AuthenticationResult

  if (!tokens?.AccessToken || !tokens.IdToken) {
    throw new Error('Cognito did not return refreshed tokens')
  }

  return {
    accessToken: tokens.AccessToken,
    idToken: tokens.IdToken,
    refreshToken: tokens.RefreshToken ?? refreshToken,
    expiresIn: tokens.ExpiresIn ?? 3600,
  }
}

function getAuthCookiePayload({
  email,
  accessToken,
  idToken,
  refreshToken,
  expiresIn,
}: {
  email: string
  accessToken: string
  idToken: string
  refreshToken: string
  expiresIn: number
}) {
  return [
    {
      name: authCookieNames.accessToken,
      value: accessToken,
      maxAge: expiresIn,
    },
    {
      name: authCookieNames.idToken,
      value: idToken,
      maxAge: expiresIn,
    },
    {
      name: authCookieNames.refreshToken,
      value: refreshToken,
      maxAge: refreshTokenMaxAge,
    },
    {
      name: authCookieNames.email,
      value: email,
      maxAge: refreshTokenMaxAge,
    },
    {
      name: authCookieNames.role,
      value: getRoleFromIdToken(idToken),
      maxAge: refreshTokenMaxAge,
    },
  ]
}

function applyAuthCookiesToRequest(
  request: NextRequest,
  cookies: ReturnType<typeof getAuthCookiePayload>,
) {
  for (const cookie of cookies) {
    request.cookies.set(cookie.name, cookie.value)
  }
}

function applyAuthCookiesToResponse(
  response: NextResponse,
  cookies: ReturnType<typeof getAuthCookiePayload>,
) {
  for (const cookie of cookies) {
    response.cookies.set(
      cookie.name,
      cookie.value,
      getAuthCookieOptions(cookie.maxAge),
    )
  }
}

function clearAuthCookiesFromRequest(request: NextRequest) {
  Object.values(authCookieNames).forEach((name) => {
    request.cookies.delete(name)
  })
}

function clearAuthCookiesFromResponse(response: NextResponse) {
  Object.values(authCookieNames).forEach((name) => {
    response.cookies.set(name, '', getAuthCookieOptions(0))
  })
}

export async function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get(authCookieNames.refreshToken)?.value

  if (!refreshToken) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(authCookieNames.accessToken)?.value
  const idToken = request.cookies.get(authCookieNames.idToken)?.value

  if (!isTokenExpired(accessToken) && !isTokenExpired(idToken)) {
    return NextResponse.next()
  }

  const email = request.cookies.get(authCookieNames.email)?.value

  if (!email) {
    clearAuthCookiesFromRequest(request)
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    clearAuthCookiesFromResponse(response)
    return response
  }

  try {
    const tokens = await refreshCognitoSession({ email, refreshToken })
    const cookies = getAuthCookiePayload({
      email,
      accessToken: tokens.accessToken,
      idToken: tokens.idToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    })

    applyAuthCookiesToRequest(request, cookies)

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    applyAuthCookiesToResponse(response, cookies)

    return response
  } catch (error) {
    console.error('Unable to refresh auth session:', error)
    clearAuthCookiesFromRequest(request)
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
    clearAuthCookiesFromResponse(response)
    return response
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
