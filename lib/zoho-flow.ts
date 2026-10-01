const ZOHO_FLOW_WEBHOOK_URL =
  'https://flow.zoho.in/60088132443/flow/webhook/incoming?zapikey=1001.d082e81bbf887945b4c8a066859d1e13.87b8106b988d4a07bb84951211e9d682&isdebug=false'

export type OrderLineItem = {
  productName: string
  quantity: number
  productPrice: number // in paise
  variantTitle: string | null
}

type ZohoLeadPayload = {
  first_name: string
  last_name: string
  email: string
  mobile: string
  Secondary_Mobile: string
  address: string
  pincode: string
  place: string
  product_name: string
  quantity: string
  description: string
  Lead_Status: string
}

// Splits "Rahul Sharma" → { first_name: "Rahul", last_name: "Sharma" }
// last_name is mandatory in Zoho
function splitFullName(fullName: string): { first_name: string; last_name: string } {
  const trimmed = (fullName ?? '').trim()
  const spaceIndex = trimmed.lastIndexOf(' ')

  if (spaceIndex === -1) {
    return { first_name: '', last_name: trimmed || 'Customer' }
  }

  return {
    first_name: trimmed.slice(0, spaceIndex).trim(),
    last_name: trimmed.slice(spaceIndex + 1).trim(),
  }
}

// Converts paise to INR string e.g. 50000 → "₹500"
function formatPrice(amountInPaise: number): string {
  return `₹${(amountInPaise / 100).toLocaleString('en-IN')}`
}

export function buildZohoPayload(input: {
  fullName: string
  email: string
  shippingPhone: string
  userPhone: string | null | undefined
  addressLine1: string
  addressLine2: string | null | undefined
  city: string
  state: string
  postalCode: string
  orderStatus: string
  items: OrderLineItem[]
}): ZohoLeadPayload {
  const { first_name, last_name } = splitFullName(input.fullName)

  const address = [
    input.addressLine1,
    input.addressLine2,
    input.city,
    input.state,
    input.postalCode,
  ].filter(Boolean).join(', ')

  // All three are comma-separated and index-aligned
  const product_name = input.items.map((i) => i.productName).join(', ')
  const quantity = input.items.map((i) => String(i.quantity)).join(', ')
  const description = input.items
    .map((i) => `${i.variantTitle ?? i.productName} - ${formatPrice(i.productPrice)}`)
    .join(', ')

  return {
    first_name,
    last_name,
    email: input.email,
    mobile: input.shippingPhone,
    Secondary_Mobile: input.userPhone ?? '',
    address,
    pincode: input.postalCode,
    place: input.city,
    product_name,
    quantity,
    description,
    Lead_Status: input.orderStatus === 'paid' ? 'Paid' : 'Pending',
  }
}

export async function pushLeadToZohoFlow(payload: ZohoLeadPayload): Promise<void> {
  const response = await fetch(ZOHO_FLOW_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Zoho Flow push failed: HTTP ${response.status} — ${text}`)
  }
}
