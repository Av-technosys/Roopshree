export type CartAttribute = {
  name: string
  value: string
}

export type CartItem = {
  productId: string
  dbProductId?: string
  variantId?: string
  title: string
  price: number
  stockQuantity?: number
  image: string
  colour?: string
  imageClass?: string
  attributes?: CartAttribute[]
  quantity: number
  addedAt: number
}

export type CartItemInput = Omit<CartItem, "quantity" | "addedAt">
