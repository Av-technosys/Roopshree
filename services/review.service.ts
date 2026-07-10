import { revalidatePath } from 'next/cache'

import {
  countUserReviews,
  createProductReview,
  findDeliveredReviewItems,
  listAdminReviewRows,
  listReviewMediaRows,
  listUserReviews,
  updateReviewStatusRecord,
  userCanReviewProduct,
  userHasReviewedProduct,
  type ReviewStatus,
} from '@/repositories/review.repository'
import { getCurrentDbUserId } from '@/lib/current-db-user'
import { getCurrentUser } from '@/lib/auth'
import { getS3ObjectPreviewUrl } from '@/lib/s3'

export type { ReviewStatus } from '@/repositories/review.repository'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(amountInPaise: number) {
  return `₹${(amountInPaise / 100).toLocaleString('en-IN')}`
}

function normalizeReviewStatus(status: string): ReviewStatus {
  return status === 'approved' ? 'accepted' : (status as ReviewStatus)
}

export async function getDashboardReviewData() {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return { pending: [], submitted: [] }
  }

  const [pendingItems, submittedReviews] = await Promise.all([
    findDeliveredReviewItems(userId),
    listUserReviews(userId),
  ])

  return {
    pending: pendingItems.map((item) => ({
      orderId: item.orderId,
      orderNumber: item.orderNumber,
      orderItemId: item.orderItemId,
      productId: item.productId,
      productName: item.productName,
      image: item.productImage ? getS3ObjectPreviewUrl(item.productImage) : '/home/new-arrival-model.png',
      variant: item.variantTitle ?? '',
      quantity: item.quantity,
      date: formatDate(item.orderedAt),
      total: formatCurrency(item.productPrice * item.quantity),
    })),
    submitted: submittedReviews.map((review) => ({
      id: review.id,
      productId: review.productId,
      productName: review.productName,
      productSlug: review.productSlug,
      rating: review.rating,
      title: review.title ?? 'Customer review',
      message: review.message,
      status: normalizeReviewStatus(review.status),
      date: formatDate(review.createdAt),
    })),
  }
}

export async function getDashboardReviewCount() {
  const userId = await getCurrentDbUserId()

  if (!userId) {
    return 0
  }

  return countUserReviews(userId)
}

export async function submitProductReview(input: {
  orderId: string
  productId: string
  rating: number
  title: string
  message: string
  media?: { key: string; contentType: string }[]
}) {
  const userId = await getCurrentDbUserId()
  const currentUser = await getCurrentUser()

  if (!userId) {
    return { success: false, message: 'Please sign in to submit a review.' }
  }

  const rating = Math.min(5, Math.max(1, Math.round(input.rating)))
  const title = input.title.trim()
  const message = input.message.trim()

  if (!title || !message) {
    return { success: false, message: 'Review title and message are required.' }
  }

  const canReview = await userCanReviewProduct({
    userId,
    orderId: input.orderId,
    productId: input.productId,
  })

  if (!canReview) {
    return {
      success: false,
      message: 'Reviews are available only for delivered orders.',
    }
  }

  const alreadyReviewed = await userHasReviewedProduct(userId, input.productId)

  if (alreadyReviewed) {
    return { success: false, message: 'You have already reviewed this product.' }
  }

  await createProductReview({
    userId,
    productId: input.productId,
    rating,
    title,
    message,
    reviewerName: currentUser?.name ?? null,
    reviewerEmail: currentUser?.email ?? null,
    media: input.media?.slice(0, 5),
  })

  revalidatePath('/dashboard/reviews')
  revalidatePath('/admin/reviews')

  return { success: true, message: 'Review submitted for approval.' }
}

export async function getAdminReviews() {
  const rows = await listAdminReviewRows()
  const mediaRows = await listReviewMediaRows(rows.map((row) => row.id))

  return rows.map((row) => ({
    id: row.id,
    productName: row.productName,
    userName: row.userName ?? row.reviewerName ?? 'Customer',
    rating: row.rating,
    title: row.title ?? 'Customer review',
    review: row.message,
    submittedAt: formatDate(row.createdAt),
    status: normalizeReviewStatus(row.status),
    media: mediaRows
      .filter((media) => media.reviewId === row.id)
      .map((media) => ({
        url: getS3ObjectPreviewUrl(media.key),
        contentType: media.contentType,
      })),
  }))
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  const product = await updateReviewStatusRecord(id, status)

  revalidatePath('/admin/reviews')
  revalidatePath('/shop')
  if (product?.slug) {
    revalidatePath(`/product/${product.slug}`)
  }

  return { success: true, message: 'Review status updated.' }
}
