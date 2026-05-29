import { findOrderById } from '@/repositories/order.repository'

export async function createPaymentIntent(orderId: string) {
  const order = await findOrderById(orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  return {
    orderId,
    amount: order.totalInPaise,
    currency: 'INR',
  }
}

export async function verifyPayment(paymentId: string) {
  return {
    paymentId,
    verified: true,
  }
}
