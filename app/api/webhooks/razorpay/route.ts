import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { orders, orderItems, payments } from '@/db/schema/orders'
import { users } from '@/db/schema/users'
import { buildZohoPayload, pushLeadToZohoFlow } from '@/lib/zoho-flow'

type RazorpayWebhookPayload = {
  event: string
  payload: {
    payment?: {
      entity?: {
        id?: string
        order_id?: string
        amount?: number
        status?: string
      }
    }
  }
}

// Layer 1: Verifies the HMAC-SHA256 signature from Razorpay
function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RZ_WEBHOOK_SECRET

  if (!secret) {
    console.error('[Webhook] RZ_WEBHOOK_SECRET is not configured')
    return false
  }

  if (!signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    // timingSafeEqual throws if buffers differ in length
    return false
  }
}

// Layer 3: Fetches full order details from DB and pushes lead to Zoho Flow
async function syncOrderToZoho(razorpayOrderId: string): Promise<void> {
  const [payment] = await db
    .select({ orderId: payments.orderId })
    .from(payments)
    .where(eq(payments.providerOrderId, razorpayOrderId))
    .limit(1)

  if (!payment) {
    console.error(`[Zoho Sync] No payment found for Razorpay order: ${razorpayOrderId}`)
    return
  }

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      shippingPhone: orders.shippingPhone,
      addressLine1: orders.addressLine1,
      addressLine2: orders.addressLine2,
      city: orders.city,
      state: orders.state,
      postalCode: orders.postalCode,
      userId: orders.userId,
    })
    .from(orders)
    .where(eq(orders.id, payment.orderId))
    .limit(1)

  if (!order) {
    console.error(`[Zoho Sync] Order not found: ${payment.orderId}`)
    return
  }

  const items = await db
    .select({
      productName: orderItems.productName,
      quantity: orderItems.quantity,
      productPrice: orderItems.productPrice,
      variantTitle: orderItems.variantTitle,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))

  let userName = 'Customer'
  let userEmail = ''
  let userPhone: string | null = null

  if (order.userId) {
    const [user] = await db
      .select({ name: users.name, email: users.email, phone: users.phone })
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1)

    if (user) {
      userName = user.name ?? 'Customer'
      userEmail = user.email
      userPhone = user.phone ?? null
    }
  }

  const payload = buildZohoPayload({
    fullName: userName,
    email: userEmail,
    shippingPhone: order.shippingPhone,
    userPhone,
    addressLine1: order.addressLine1,
    addressLine2: order.addressLine2,
    city: order.city,
    state: order.state,
    postalCode: order.postalCode,
    orderStatus: order.status,
    items,
  })

  await pushLeadToZohoFlow(payload)

  console.log(`[Zoho Sync] Lead pushed for order: ${order.orderNumber}`)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Raw body must be read as text before JSON.parse to preserve the exact bytes for signature verification
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  // Layer 1: Reject if signature is invalid
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[Webhook] Invalid signature — rejected')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Layer 2: Parse and filter — only act on payment.captured
  let body: RazorpayWebhookPayload

  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.event !== 'payment.captured') {
    return NextResponse.json({ received: true }, { status: 200 })
  }

  const razorpayOrderId = body.payload?.payment?.entity?.order_id

  if (!razorpayOrderId) {
    console.error('[Webhook] payment.captured missing order_id')
    return NextResponse.json({ received: true }, { status: 200 })
  }

  // Layer 3: Sync to Zoho — errors are caught so Razorpay doesn't retry
  try {
    await syncOrderToZoho(razorpayOrderId)
  } catch (err) {
    console.error('[Webhook] Zoho sync failed:', err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
