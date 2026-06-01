import { and, count, desc, eq, inArray, sql } from 'drizzle-orm'

import { orderItems, orders } from '@/db/schema/orders'
import { mediaAssets, products } from '@/db/schema/products'
import { reviewMedia, reviews } from '@/db/schema/reviews'
import { users } from '@/db/schema/users'
import { db } from '@/lib/db'

export type ReviewStatus = 'pending' | 'accepted' | 'rejected'
type StoredReviewStatus = ReviewStatus | 'approved'

export async function findDeliveredReviewItems(userId: string) {
  const rows = await db
    .select({
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      orderedAt: orders.createdAt,
      orderItemId: orderItems.id,
      productId: products.id,
      productName: orderItems.productName,
      productSlug: orderItems.productSlug,
      productImage: orderItems.productImage,
      variantTitle: orderItems.variantTitle,
      quantity: orderItems.quantity,
      productPrice: orderItems.productPrice,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(products.slug, orderItems.productSlug))
    .where(and(eq(orders.userId, userId), eq(orders.status, 'delivered')))
    .orderBy(desc(orders.createdAt))

  if (rows.length === 0) {
    return []
  }

  const productIds = [...new Set(rows.map((row) => row.productId))]
  const submittedReviews = await db
    .select({ productId: reviews.productId })
    .from(reviews)
    .where(and(eq(reviews.userId, userId), inArray(reviews.productId, productIds)))

  const reviewedProductIds = new Set(submittedReviews.map((review) => review.productId))

  return rows.filter((row) => !reviewedProductIds.has(row.productId))
}

export async function listUserReviews(userId: string) {
  return db
    .select({
      id: reviews.id,
      productId: reviews.productId,
      productName: products.name,
      productSlug: products.slug,
      rating: reviews.rating,
      title: reviews.title,
      message: reviews.message,
      status: reviews.status,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(products, eq(products.id, reviews.productId))
    .where(eq(reviews.userId, userId))
    .orderBy(desc(reviews.createdAt))
}

export async function countUserReviews(userId: string) {
  const [row] = await db
    .select({ value: count() })
    .from(reviews)
    .where(eq(reviews.userId, userId))

  return row?.value ?? 0
}

export async function userCanReviewProduct({
  userId,
  orderId,
  productId,
}: {
  userId: string
  orderId: string
  productId: string
}) {
  const [row] = await db
    .select({ productId: products.id })
    .from(orders)
    .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(products.slug, orderItems.productSlug))
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.userId, userId),
        eq(orders.status, 'delivered'),
        eq(products.id, productId),
      ),
    )
    .limit(1)

  return Boolean(row)
}

export async function userHasReviewedProduct(userId: string, productId: string) {
  const [row] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
    .limit(1)

  return Boolean(row)
}

export async function createProductReview(input: {
  userId: string
  productId: string
  rating: number
  title: string
  message: string
  reviewerName?: string | null
  reviewerEmail?: string | null
  media?: { key: string; contentType: string }[]
}) {
  const review = await db.transaction(async (tx) => {
    const [createdReview] = await tx
      .insert(reviews)
      .values({
        userId: input.userId,
        productId: input.productId,
        rating: input.rating,
        title: input.title,
        message: input.message,
        reviewerName: input.reviewerName,
        reviewerEmail: input.reviewerEmail,
      })
      .returning({ id: reviews.id })

    for (const [index, item] of (input.media ?? []).entries()) {
      const [asset] = await tx
        .insert(mediaAssets)
        .values({
          key: item.key,
          contentType: item.contentType,
          ownerType: 'review',
        })
        .onConflictDoUpdate({
          target: mediaAssets.key,
          set: {
            contentType: item.contentType,
            ownerType: 'review',
          },
        })
        .returning({ id: mediaAssets.id })

      await tx.insert(reviewMedia).values({
        reviewId: createdReview.id,
        mediaAssetId: asset.id,
        sortOrder: index,
      })
    }

    return createdReview
  })

  return review
}

export async function listAdminReviewRows() {
  return db
    .select({
      id: reviews.id,
      productName: products.name,
      userName: users.name,
      reviewerName: reviews.reviewerName,
      rating: reviews.rating,
      title: reviews.title,
      message: reviews.message,
      status: reviews.status,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(products, eq(products.id, reviews.productId))
    .leftJoin(users, eq(users.id, reviews.userId))
    .orderBy(desc(reviews.createdAt))
}

export async function listReviewMediaRows(reviewIds: string[]) {
  if (!reviewIds.length) {
    return []
  }

  return db
    .select({
      reviewId: reviewMedia.reviewId,
      key: mediaAssets.key,
      contentType: mediaAssets.contentType,
      sortOrder: reviewMedia.sortOrder,
    })
    .from(reviewMedia)
    .innerJoin(mediaAssets, eq(mediaAssets.id, reviewMedia.mediaAssetId))
    .where(inArray(reviewMedia.reviewId, reviewIds))
    .orderBy(reviewMedia.sortOrder)
}

export async function updateReviewStatusRecord(id: string, status: ReviewStatus) {
  async function persist(nextStatus: StoredReviewStatus) {
    return db.transaction(async (tx) => {
      const [updatedReview] = await tx
        .update(reviews)
        .set({
          status: nextStatus as typeof reviews.$inferInsert.status,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, id))
        .returning({ productId: reviews.productId })

      if (!updatedReview) {
        return null
      }

      const [ratingStats] = await tx
        .select({
          averageRating: sql<string | null>`avg(${reviews.rating})`,
          reviewCount: sql<number>`count(*)::int`,
        })
        .from(reviews)
        .where(
          and(
            eq(reviews.productId, updatedReview.productId),
            sql`${reviews.status}::text in ('accepted', 'approved')`,
          ),
        )

      await tx
        .update(products)
        .set({
          rating: Math.round(Number(ratingStats?.averageRating ?? 0) * 100),
          reviewCount: Number(ratingStats?.reviewCount ?? 0),
          updatedAt: new Date(),
        })
        .where(eq(products.id, updatedReview.productId))

      const [product] = await tx
        .select({ slug: products.slug })
        .from(products)
        .where(eq(products.id, updatedReview.productId))
        .limit(1)

      return product
    })
  }

  try {
    return await persist(status)
  } catch (error) {
    if (status !== 'accepted') {
      throw error
    }

    return persist('approved')
  }
}
