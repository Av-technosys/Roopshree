// TEMPORARY TEST ROUTE — DELETE BEFORE FINAL PRODUCTION RELEASE
// Hit this with a GET to verify Zoho Flow receives data correctly
// e.g. https://yourdomain.com/api/razorpay/webhook/test

import { NextResponse } from 'next/server'
import { buildZohoPayload, pushLeadToZohoFlow } from '@/lib/zoho-flow'

export async function GET() {
  const payload = buildZohoPayload({
    fullName: 'Test Customer',
    email: 'test@example.com',
    shippingPhone: '9876543210',
    userPhone: '9123456789',
    addressLine1: '123 Test Street',
    addressLine2: 'Near Test Colony',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    orderStatus: 'paid',
    items: [
      { productName: 'Sindoor', quantity: 2, productPrice: 50000, variantTitle: 'Red' },
      { productName: 'Face Cream', quantity: 1, productPrice: 75000, variantTitle: null },
    ],
  })

  await pushLeadToZohoFlow(payload)

  return NextResponse.json({ success: true, payload })
}
