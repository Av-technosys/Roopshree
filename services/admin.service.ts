import {
  findOrderDetails,
  findOrdersPage,
  findPurchasePaymentsPage,
  updateOrderStatusRecord,
} from '@/repositories/admin.repository'
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
  await updateOrderStatusRecord(orderId, status)

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
