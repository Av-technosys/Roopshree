import { db } from '@/lib/db'
import type { ProductPayload } from '@/validators/product.validator'

type ProductRecord = ProductPayload & {
  id: string
  priceInPaise: number
}

export async function createProductRecord(
  payload: ProductPayload & { priceInPaise: number },
): Promise<ProductRecord> {
  void db
  void payload

  // Replace with a Drizzle insert once product schema is available.
  throw new Error('Product create query not implemented')
}

export async function findProductById(
  productId: string,
): Promise<ProductRecord | null> {
  void db
  void productId

  // Replace with a Drizzle select by id.
  return null satisfies ProductRecord | null
}

export async function updateProductRecord(
  productId: string,
  payload: ProductPayload & { priceInPaise: number },
): Promise<ProductRecord> {
  void db
  void productId
  void payload

  // Replace with a Drizzle update by id.
  throw new Error('Product update query not implemented')
}
