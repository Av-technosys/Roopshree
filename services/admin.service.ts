import {
  findOrderDetails,
  findOrdersPage,
  findPurchasePaymentsPage,
  updateOrderStatusRecord,
} from '@/repositories/admin.repository'
import {
  notifyOrderDeliveredEmail,
  notifyOrderShippedEmail,
} from '@/lib/email-notifications'
import type { OrderQuery, PaymentQuery } from '@/validators/admin-query.validator'

function pageMeta(page: number, pageSize: number, totalItems: number) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
  }
}

export async function fetchOrdersService(query: OrderQuery = {}) {
  const result = await findOrdersPage(query)

  return {
    data: result.data,
    meta: pageMeta(result.page, result.pageSize, result.totalItems),
  }
}

export async function updateOrderStatusService(orderId: string, status: string) {
  const order = await updateOrderStatusRecord(orderId, status)

  if (order?.userEmail && order.previousStatus !== status) {
    const customerName =
      order.userName || order.userEmail.split('@')[0] || 'Customer'
    const orderNumber = order.orderNumber || order.id

    if (status === 'shipped') {
      try {
        await notifyOrderShippedEmail({
          email: order.userEmail,
          customerName,
          orderId: orderNumber,
          courierName: order.courierName,
          trackingNumber: order.trackingNumber,
          trackingLink: order.trackingUrl,
        })
      } catch (emailError) {
        console.error('Unable to send shipping email:', emailError)
      }
    }

    if (status === 'delivered') {
      try {
        await notifyOrderDeliveredEmail({
          email: order.userEmail,
          customerName,
          orderId: orderNumber,
          deliveryDate: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        })
      } catch (emailError) {
        console.error('Unable to send delivery email:', emailError)
      }
    }
  }

  return { success: true, message: 'Order status updated' }
}

export async function fetchOrderDetailsService(id: string) {
  return findOrderDetails(id)
}

export async function fetchPurchasePaymentsService(query: PaymentQuery = {}) {
  const result = await findPurchasePaymentsPage(query)

  return {
    data: result.rows.map((row) => ({
      ...row,
      payment: {
        ...row.payment,
        paymentAmount: row.payment.amountInPaise,
        paymentMethod: row.payment.method,
        paymentStatus: row.payment.status,
        paymentId: row.payment.providerPaymentId,
        paymentOrderId: row.payment.providerOrderId,
      },
    })),
    meta: pageMeta(result.page, result.pageSize, result.totalItems),
  }
}
