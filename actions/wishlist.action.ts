"use server"

import { and, asc, count, eq, sql } from "drizzle-orm"

import { wishlistItems, wishlists } from "@/db/schema/orders"
import {
  mediaAssets,
  productMedia,
  products,
  productVariants,
} from "@/db/schema/products"
import { db } from "@/lib/db"
import { getCurrentDbUserId } from "@/lib/current-db-user"
import { getS3ObjectPreviewUrl } from "@/lib/s3"

type WishlistMutationInput = {
  productId?: string
  isWishlisted?: boolean
}

async function getOrCreateLockedWishlist(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  userId: string,
) {
  let [wishlist] = await tx
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .limit(1)

  if (!wishlist) {
    const [createdWishlist] = await tx
      .insert(wishlists)
      .values({ userId })
      .onConflictDoNothing({ target: wishlists.userId })
      .returning()
    wishlist = createdWishlist
  }

  if (!wishlist) {
    const [existingWishlist] = await tx
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, userId))
      .limit(1)
    wishlist = existingWishlist
  }

  if (!wishlist) {
    throw new Error("Unable to create wishlist")
  }

  await tx.execute(sql`SELECT id FROM wishlists WHERE id = ${wishlist.id} FOR UPDATE`)

  return wishlist
}

async function validateProductExists(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  productId: string,
) {
  const [product] = await tx
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  return Boolean(product)
}

export async function setUserWishlistItem(input: WishlistMutationInput) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!input.productId) {
    return { success: false, message: "Product id is required" }
  }

  try {
    await db.transaction(async (tx) => {
      const productExists = await validateProductExists(tx, input.productId as string)

      if (!productExists) {
        throw new Error("Product not found")
      }

      const wishlist = await getOrCreateLockedWishlist(tx, userId)
      const [existingItem] = await tx
        .select()
        .from(wishlistItems)
        .where(
          and(
            eq(wishlistItems.wishlistId, wishlist.id),
            eq(wishlistItems.productId, input.productId as string),
          ),
        )
        .limit(1)

      if (input.isWishlisted) {
        if (!existingItem) {
          await tx.insert(wishlistItems).values({
            wishlistId: wishlist.id,
            productId: input.productId as string,
          })
        }

        return
      }

      if (existingItem) {
        await tx.delete(wishlistItems).where(eq(wishlistItems.id, existingItem.id))
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Set wishlist item failed:", error)
    return { success: false, message: "Failed to update wishlist" }
  }
}

export async function toggleUserWishlistItem(productId?: string) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!productId) {
    return { success: false, message: "Product id is required" }
  }

  try {
    await db.transaction(async (tx) => {
      const wishlist = await getOrCreateLockedWishlist(tx, userId)
      const [existingItem] = await tx
        .select()
        .from(wishlistItems)
        .where(
          and(
            eq(wishlistItems.wishlistId, wishlist.id),
            eq(wishlistItems.productId, productId),
          ),
        )
        .limit(1)

      if (existingItem) {
        await tx.delete(wishlistItems).where(eq(wishlistItems.id, existingItem.id))
        return
      }

      await tx.insert(wishlistItems).values({
        wishlistId: wishlist.id,
        productId,
      })
    })

    return { success: true }
  } catch (error) {
    console.error("Toggle wishlist failed:", error)
    return { success: false, message: "Failed to update wishlist" }
  }
}

export async function removeUserWishlistItem(productId?: string) {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true }
  }

  if (!productId) {
    return { success: false, message: "Product id is required" }
  }

  try {
    await db.transaction(async (tx) => {
      const wishlist = await getOrCreateLockedWishlist(tx, userId)

      await tx
        .delete(wishlistItems)
        .where(
          and(
            eq(wishlistItems.wishlistId, wishlist.id),
            eq(wishlistItems.productId, productId),
          ),
        )
    })

    return { success: true }
  } catch (error) {
    console.error("Remove wishlist failed:", error)
    return { success: false, message: "Failed to update wishlist" }
  }
}

export async function getUserWishlistItems() {
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
        imageKey: mediaAssets.key,
        variantId: productVariants.id,
        variantTitle: productVariants.title,
        variantPrice: productVariants.price,
        variantColor: productVariants.color,
        variantFabric: productVariants.fabric,
        variantSize: productVariants.size,
        variantStockQuantity: productVariants.stockQuantity,
        variantBannerImage: productVariants.bannerImage,
        addedAt: wishlistItems.createdAt,
      })
      .from(wishlists)
      .innerJoin(wishlistItems, eq(wishlistItems.wishlistId, wishlists.id))
      .innerJoin(products, eq(products.id, wishlistItems.productId))
      .leftJoin(
        productVariants,
        and(
          eq(productVariants.productId, products.id),
          eq(productVariants.isDefault, true),
          eq(productVariants.isActive, true),
        ),
      )
      .leftJoin(
        productMedia,
        and(
          eq(productMedia.productId, products.id),
          eq(productMedia.variantId, productVariants.id),
          eq(productMedia.isPrimary, true),
        ),
      )
      .leftJoin(mediaAssets, eq(mediaAssets.id, productMedia.mediaAssetId))
      .where(eq(wishlists.userId, userId))
      .orderBy(asc(wishlistItems.createdAt))

    const items = rows.map((row) => {
      const imageKey = row.imageKey ?? row.variantBannerImage
      const productId = row.variantId ? `${row.slug}:${row.variantId}` : row.slug
      const attributes = [
        row.variantColor ? { name: "Colour", value: row.variantColor } : null,
        row.variantFabric ? { name: "Fabric", value: row.variantFabric } : null,
        row.variantSize ? { name: "Size", value: row.variantSize } : null,
      ].filter((attribute): attribute is { name: string; value: string } =>
        Boolean(attribute),
      )

 
      return {
        productId,
        dbProductId: row.productId,
        variantId: row.variantId ?? undefined,
        title: row.variantTitle ?? row.name,
        price: (row.variantPrice ?? row.basePrice) / 100,
        stockQuantity: row.variantStockQuantity ?? undefined,
        image: imageKey ? getS3ObjectPreviewUrl(imageKey) : "",
        colour: row.variantColor ?? undefined,
        imageClass: "object-top",
        attributes: attributes.length > 0 ? attributes : undefined,
        addedAt: row.addedAt.getTime(),
      }
    })

    return { success: true, items }
  } catch (error) {
    console.error("Get wishlist items failed:", error)
    return { success: false, message: "Failed to load wishlist", items: [] }
  }
}

export async function getUserWishlistCount() {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return 0
  }

  try {
    const [row] = await db
      .select({ value: count() })
      .from(wishlists)
      .innerJoin(wishlistItems, eq(wishlistItems.wishlistId, wishlists.id))
      .where(eq(wishlists.userId, userId))

    return row?.value ?? 0
  } catch (error) {
    console.error("Get wishlist count failed:", error)
    return 0
  }
}
