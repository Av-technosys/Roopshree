export type ProfilePayload = {
  fullName: string
  phone: string
}

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateProfilePayload(payload: unknown): ProfilePayload {
  const data = payload as Partial<Record<keyof ProfilePayload, unknown>>
  const fullName = getString(data.fullName)
  const phone = getString(data.phone)

  if (!fullName) {
    throw new Error('Full name is required')
  }

  if (!phone) {
    throw new Error('Mobile number is required')
  }

  return {
    fullName,
    phone,
  }
}
