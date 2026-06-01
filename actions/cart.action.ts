"use server"

import { and, asc, desc, eq, sql } from "drizzle-orm"

import { cartItems, carts } from "@/db/schema/orders"
import {
  mediaAssets,
  productMedia,
  products,
  productVariants,
} from "@/db/schema/products"
import { getS3ObjectPreviewUrl } from "@/lib/s3"
import { db } from "@/lib/db"
import { getCurrentDbUserId } from "@/lib/current-db-user"

type CartMutationInput = {
  productId?: string
  variantId?: string | null
  quantity?: number
}

type CartTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

class CartMutationError extends Error {}

function normalizeRequestedQuantity(quantity?: number) {
  const numericQuantity = Number(quantity ?? 1)

  if (!Number.isFinite(numericQuantity)) {
    return null
  }

  return Math.trunc(numericQuantity)
}

async function resolveCartLine(
  tx: CartTransaction,
  productId: string,
  variantId?: string | null,
) {
  const [product] = await tx
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  if (!product) {
    throw new CartMutationError("Product not found")
  }

  const [variant] = await tx
    .select({
      id: productVariants.id,
      isActive: productVariants.isActive,
      stockQuantity: productVariants.stockQuantity,
    })
    .from(productVariants)
    .where(
      variantId
        ? and(
            eq(productVariants.id, variantId),
            eq(productVariants.productId, productId),
          )
        : and(
            eq(productVariants.productId, productId),
            eq(productVariants.isActive, true),
          ),
    )
    .orderBy(desc(productVariants.isDefault), asc(productVariants.title))
    .limit(1)

  if (!variant) {
    throw new CartMutationError(
      variantId ? "Variant not found for product" : "Product variant not found",
    )
  }

  return {
    variantId: variant.id,
    isActive: variant.isActive,
    stockQuantity: variant.stockQuantity,
  }
}

function validatePositiveQuantity(quantity: number) {
  if (quantity <= 0) {
    throw new CartMutationError("Quantity must be positive")
  }
}

function validateStock(stockQuantity: number, requestedQuantity: number) {
  if (requestedQuantity > stockQuantity) {
    throw new CartMutationError("Requested quantity is not available")
  }
}

async function getOrCreateLockedCart(
  tx: CartTransaction,
  userId: string,
) {
  let [cart] = await tx
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1)

  if (!cart) {
    const [createdCart] = await tx
      .insert(carts)
      .values({ userId })
      .onConflictDoNothing({ target: carts.userId })
      .returning()
    cart = createdCart
  }

  if (!cart) {
    const [existingCart] = await tx
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1)
    cart = existingCart
  }

  if (!cart) {
    throw new Error("Unable to create cart")
  }

  await tx.execute(sql`SELECT id FROM carts WHERE id = ${cart.id} FOR UPDATE`)

  return cart
}

function getCartItemWhere(
  cartId: string,
  input: Required<Pick<CartMutationInput, "productId">> &
    Pick<CartMutationInput, "variantId">,
) {
  return and(
    eq(cartItems.cartId, cartId),
    eq(cartItems.productId, input.productId),
    input.variantId
      ? eq(cartItems.variantId, input.variantId)
      : sql`${cartItems.variantId} IS NULL`,
  )
}

export async function setUserCartItemQuantity(input: CartMutationInput) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!input.productId) {
    return { success: false, message: "Product id is required" }
  }

  const productId = input.productId
  const quantity = normalizeRequestedQuantity(input.quantity)

  if (quantity === null) {
    return { success: false, message: "Quantity is required" }
  }

  try {
    await db.transaction(async (tx) => {
      const cart = await getOrCreateLockedCart(tx, userId)
      let variantId = input.variantId ?? null
      let existingProductItemId: string | null = null

      if (!variantId) {
        const existingProductItems = await tx
          .select({
            id: cartItems.id,
            variantId: cartItems.variantId,
          })
          .from(cartItems)
          .where(
            and(
              eq(cartItems.cartId, cart.id),
              eq(cartItems.productId, productId),
            ),
          )
          .limit(2)

        if (existingProductItems.length === 1) {
          existingProductItemId = existingProductItems[0].id
          variantId = existingProductItems[0].variantId
        } else if (existingProductItems.length > 1) {
          throw new CartMutationError("Variant id is required")
        }
      }

      const cartLine = await resolveCartLine(tx, productId, variantId)

      if (quantity <= 0) {
        if (existingProductItemId && !input.variantId) {
          await tx.delete(cartItems).where(eq(cartItems.id, existingProductItemId))
        } else {
          await tx
            .delete(cartItems)
            .where(
              getCartItemWhere(cart.id, {
                productId,
                variantId: cartLine.variantId,
              }),
            )
        }

        return
      }

      validatePositiveQuantity(quantity)

      if (!cartLine.isActive) {
        throw new CartMutationError("Product variant is not active")
      }

      validateStock(cartLine.stockQuantity, quantity)

      const [existingItem] = await tx
        .select()
        .from(cartItems)
        .where(
          getCartItemWhere(cart.id, {
            productId,
            variantId: cartLine.variantId,
          }),
        )
        .limit(1)

      const [legacyExistingItem] =
        !existingItem && existingProductItemId && !input.variantId
          ? await tx
              .select()
              .from(cartItems)
              .where(eq(cartItems.id, existingProductItemId))
              .limit(1)
          : []
      const itemToUpdate = existingItem ?? legacyExistingItem

      if (itemToUpdate) {
        await tx
          .update(cartItems)
          .set({ quantity, variantId: cartLine.variantId })
          .where(eq(cartItems.id, itemToUpdate.id))
        return
      }

      await tx.insert(cartItems).values({
        cartId: cart.id,
        productId,
        variantId: cartLine.variantId,
        quantity,
      })
    })

    return { success: true }
  } catch (error) {
    if (error instanceof CartMutationError) {
      return { success: false, message: error.message }
    }

    console.error("Set cart quantity failed:", error)
    return { success: false, message: "Failed to update cart" }
  }
}

export async function addProductToUserCart(input: CartMutationInput) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!input.productId) {
    return { success: false, message: "Product id is required" }
  }

  const quantity = Math.max(1, Number(input.quantity ?? 1))

  try {
    await db.transaction(async (tx) => {
      const cart = await getOrCreateLockedCart(tx, userId)
      const [existingItem] = await tx
        .select()
        .from(cartItems)
        .where(getCartItemWhere(cart.id, input as { productId: string; variantId?: string | null }))
        .for("update")
        .limit(1)

      if (existingItem) {
        await tx
          .update(cartItems)
          .set({ quantity: sql`${cartItems.quantity} + ${quantity}` })
          .where(eq(cartItems.id, existingItem.id))
        return
      }

      await tx.insert(cartItems).values({
        cartId: cart.id,
        productId: input.productId as string,
        variantId: input.variantId || null,
        quantity,
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Add to cart failed:", error)
    return { success: false, message: "Failed to update cart" }
  }
}

export async function changeUserCartItemQuantity(input: CartMutationInput & { delta: number }) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!input.productId) {
    return { success: false, message: "Product id is required" }
  }

  const delta = Math.trunc(Number(input.delta))

  if (!Number.isFinite(delta) || delta === 0) {
    return { success: true }
  }

  try {
    await db.transaction(async (tx) => {
      const cart = await getOrCreateLockedCart(tx, userId)
      const [existingItem] = await tx
        .select()
        .from(cartItems)
        .where(getCartItemWhere(cart.id, input as { productId: string; variantId?: string | null }))
        .for("update")
        .limit(1)

      if (!existingItem) {
        if (delta > 0) {
          await tx.insert(cartItems).values({
            cartId: cart.id,
            productId: input.productId as string,
            variantId: input.variantId || null,
            quantity: delta,
          })
        }
        return
      }

      const nextQuantity = existingItem.quantity + delta

      if (nextQuantity <= 0) {
        await tx.delete(cartItems).where(eq(cartItems.id, existingItem.id))
        return
      }

      await tx
        .update(cartItems)
        .set({ quantity: sql`${cartItems.quantity} + ${delta}` })
        .where(eq(cartItems.id, existingItem.id))
    })

    return { success: true }
  } catch (error) {
    console.error("Change cart quantity failed:", error)
    return { success: false, message: "Failed to update cart" }
  }
}

export async function removeProductFromUserCart(input: CartMutationInput) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!input.productId) {
    return { success: false, message: "Product id is required" }
  }

  try {
    await db.transaction(async (tx) => {
      const cart = await getOrCreateLockedCart(tx, userId)

      await tx
        .delete(cartItems)
        .where(getCartItemWhere(cart.id, input as { productId: string; variantId?: string | null }))
    })

    return { success: true }
  } catch (error) {
    console.error("Remove cart item failed:", error)
    return { success: false, message: "Failed to update cart" }
  }
}

export async function getUserCartItems() {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true, items: [] }
  }

  try {
    const rows = await db
      .select({
        productId: products.id,
        slug: products.slug,
        name: products.name,
        basePrice: products.basePrice,
        productImageKey: mediaAssets.key,
        variantId: productVariants.id,
        variantTitle: productVariants.title,
        variantPrice: productVariants.price,
        variantColor: productVariants.color,
        variantFabric: productVariants.fabric,
        variantSize: productVariants.size,
        variantStockQuantity: productVariants.stockQuantity,
        variantBannerImage: productVariants.bannerImage,
        quantity: cartItems.quantity,
        addedAt: cartItems.createdAt,
      })
      .from(carts)
      .innerJoin(cartItems, eq(cartItems.cartId, carts.id))
      .innerJoin(products, eq(products.id, cartItems.productId))
      .leftJoin(productVariants, eq(productVariants.id, cartItems.variantId))
      .leftJoin(
        productMedia,
        and(
          eq(productMedia.productId, products.id),
          eq(productMedia.variantId, productVariants.id),
          eq(productMedia.isPrimary, true),
        ),
      )
      .leftJoin(mediaAssets, eq(mediaAssets.id, productMedia.mediaAssetId))
      .where(eq(carts.userId, userId))
      .orderBy(asc(cartItems.createdAt))

    const items = rows.map((row) => {
      const imageKey = row.productImageKey ?? row.variantBannerImage
      const attributes = [
        row.variantColor ? { name: "Colour", value: row.variantColor } : null,
        row.variantFabric ? { name: "Fabric", value: row.variantFabric } : null,
        row.variantSize ? { name: "Size", value: row.variantSize } : null,
      ].filter((attribute): attribute is { name: string; value: string } =>
        Boolean(attribute),
      )

      return {
        productId: row.variantId ? `${row.slug}:${row.variantId}` : row.slug,
        dbProductId: row.productId,
        variantId: row.variantId ?? undefined,
        title: row.variantTitle ?? row.name,
        price: (row.variantPrice ?? row.basePrice) / 100,
        stockQuantity: row.variantStockQuantity ?? undefined,
        image: imageKey ? getS3ObjectPreviewUrl(imageKey) : "",
        colour: row.variantColor ?? undefined,
        imageClass: "object-top",
        attributes: attributes.length > 0 ? attributes : undefined,
        quantity: row.quantity,
        addedAt: row.addedAt.getTime(),
      }
    })

    return { success: true, items }
  } catch (error) {
    console.error("Get cart items failed:", error)
    return { success: false, message: "Failed to load cart", items: [] }
  }
}
