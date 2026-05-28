export type AddressPayload = {
  fullName: string
  phone: string
  line1: string
  line2?: string
  locality?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function getBoolean(value: unknown) {
  return value === true || value === 'true' || value === 'on'
}

export function validateAddressPayload(payload: unknown): AddressPayload {
  const data = payload as Partial<Record<keyof AddressPayload, unknown>>
  const fullName = getString(data.fullName)
  const phone = getString(data.phone)
  const line1 = getString(data.line1)
  const city = getString(data.city)
  const state = getString(data.state)
  const postalCode = getString(data.postalCode)
  const country = getString(data.country) || 'India'

  if (!fullName) throw new Error('Full name is required')
  if (!phone) throw new Error('Phone number is required')
  if (!line1) throw new Error('Address line is required')
  if (!city) throw new Error('City is required')
  if (!state) throw new Error('State is required')
  if (!postalCode) throw new Error('Pincode is required')

  return {
    fullName,
    phone,
    line1,
    line2: getString(data.line2) || undefined,
    locality: getString(data.locality) || undefined,
    city,
    state,
    postalCode,
    country,
    isDefault: getBoolean(data.isDefault),
  }
}
