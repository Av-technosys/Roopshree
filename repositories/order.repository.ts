import { db } from '@/lib/db'

type OrderRecord = {
  id: string
  status: string
  totalInPaise: number
}

export async function findOrderById(orderId: string): Promise<OrderRecord | null> {
  void db
  void orderId

  // Replace with a Drizzle select by id.
  return null satisfies OrderRecord | null
}

export async function updateOrderStatusRecord(
  orderId: string,
  status: string,
): Promise<OrderRecord> {
  void db
  void orderId
  void status

  // Replace with a Drizzle update by id.
  throw new Error('Order status update query not implemented')
}
