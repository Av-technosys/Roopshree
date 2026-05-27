import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { createHmac } from 'node:crypto'

type CognitoAuthResult = {
  accessToken: string
  idToken: string
  refreshToken: string
  expiresIn: number
}

type CognitoRefreshResult = Omit<CognitoAuthResult, 'refreshToken'> & {
  refreshToken?: string
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION ?? process.env.AWS_REGION,
})

function getCognitoClientId() {
  const clientId = process.env.COGNITO_CLIENT_ID

  if (!clientId) {
    throw new Error('Missing COGNITO_CLIENT_ID')
  }

  return clientId
}

function getSecretHash(username: string) {
  const clientSecret = process.env.COGNITO_CLIENT_SECRET

  if (!clientSecret) {
    return undefined
  }

  return createHmac('sha256', clientSecret)
    .update(`${username}${getCognitoClientId()}`)
    .digest('base64')
}

function buildAuthParameters(username: string, password?: string) {
  const authParameters: Record<string, string> = {
    USERNAME: username,
  }

  if (password) {
    authParameters.PASSWORD = password
  }

  const secretHash = getSecretHash(username)

  if (secretHash) {
    authParameters.SECRET_HASH = secretHash
  }

  return authParameters
}

export async function authSignIn(
  email: string,
  password: string,
): Promise<CognitoAuthResult> {
  const response = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: getCognitoClientId(),
      AuthParameters: buildAuthParameters(email, password),
    }),
  )

  const result = response.AuthenticationResult

  if (!result?.AccessToken || !result.IdToken || !result.RefreshToken) {
    throw new Error('Invalid Cognito sign-in response')
  }

  return {
    accessToken: result.AccessToken,
    idToken: result.IdToken,
    refreshToken: result.RefreshToken,
    expiresIn: result.ExpiresIn ?? 3600,
  }
}

export async function refreshCognitoTokens(
  refreshToken: string,
  username: string,
): Promise<CognitoRefreshResult> {
  const response = await cognitoClient.send(
    new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: getCognitoClientId(),
      AuthParameters: {
        ...buildAuthParameters(username),
        REFRESH_TOKEN: refreshToken,
      },
    }),
  )

  const result = response.AuthenticationResult

  if (!result?.AccessToken || !result.IdToken) {
    throw new Error('Invalid Cognito refresh response')
  }

  return {
    accessToken: result.AccessToken,
    idToken: result.IdToken,
    refreshToken: result.RefreshToken,
    expiresIn: result.ExpiresIn ?? 3600,
  }
}
