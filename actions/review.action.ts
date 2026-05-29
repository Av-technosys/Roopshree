"use server";

import {
  submitProductReview,
  updateReviewStatus,
  type ReviewStatus,
} from "@/services/review.service";

export async function submitReviewAction(input: {
  orderId: string;
  productId: string;
  rating: number;
  title: string;
  message: string;
  media?: { key: string; contentType: string }[];
}) {
  return submitProductReview(input);
}

export async function updateReviewStatusAction(id: string, status: ReviewStatus) {
  return updateReviewStatus(id, status);
}
