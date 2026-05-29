export type LoginPayload = {
  email: string
  password: string
}

export function validateLoginPayload(payload: unknown): LoginPayload {
  const data = payload as Partial<LoginPayload>

  if (!data.email || !data.password) {
    throw new Error('Invalid login payload')
  }

  return {
    email: data.email.trim().toLowerCase(),
    password: data.password,
  }
}
