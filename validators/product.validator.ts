export type ProductPayload = {
  name: string
  slug: string
  price: number
  stock: number
  isActive: boolean
}

export function validateProductPayload(payload: unknown): ProductPayload {
  const data = payload as Partial<ProductPayload>

  if (!data.name || !data.slug || typeof data.price !== 'number') {
    throw new Error('Invalid product payload')
  }

  return {
    name: data.name,
    slug: data.slug,
    price: data.price,
    stock: data.stock ?? 0,
    isActive: data.isActive ?? true,
  }
}
