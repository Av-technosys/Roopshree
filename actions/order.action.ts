'use server'

import { requireAdmin } from '@/lib/auth'
import { updateOrderStatus } from '@/services/order.service'

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdmin()

  return updateOrderStatus(orderId, status)
}
