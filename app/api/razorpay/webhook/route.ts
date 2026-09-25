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

// Layer 3 (backup): Runs only if completeRazorpayPayment (frontend) didn't push to Zoho
// Returns true if Razorpay should retry (payment not in DB yet), false otherwise
async function syncOrderToZoho(razorpayOrderId: string): Promise<boolean> {
  const [payment] = await db
    .select({ orderId: payments.orderId, metadata: payments.metadata })
    .from(payments)
    .where(eq(payments.providerOrderId, razorpayOrderId))
    .limit(1)

  // Payment not in DB yet — return true so we respond 503 and Razorpay retries
  if (!payment) {
    console.warn(`[Zoho Sync] Payment not in DB yet, requesting retry: ${razorpayOrderId}`)
    return true
  }

  // Frontend already pushed to Zoho — skip to prevent duplicate lead
  const meta = payment.metadata as Record<string, unknown> | null
  if (meta?.zoho_synced) {
    console.log(`[Zoho Sync] Already synced by frontend, skipping: ${razorpayOrderId}`)
    return false
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
    return false
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

  await pushLeadToZohoFlow(buildZohoPayload({
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
  }))

  console.log(`[Zoho Sync] Lead pushed (backup path) for order: ${order.orderNumber}`)
  return false
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Raw body must be read as text before JSON.parse to preserve bytes for signature verification
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

  // Layer 3: Backup Zoho sync
  // Returns 503 if payment not in DB yet → Razorpay retries automatically (15min, 30min, 1h...)
  try {
    const shouldRetry = await syncOrderToZoho(razorpayOrderId)

    if (shouldRetry) {
      return NextResponse.json({ retry: true }, { status: 503 })
    }
  } catch (err) {
    console.error('[Webhook] Zoho sync failed:', err)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
