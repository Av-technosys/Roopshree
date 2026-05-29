import ReviewsClient from "@/app/admin/reviews/ReviewsClient";
import { getAdminReviews } from "@/services/review.service";

export default async function ReviewsPage() {
  const reviews = await getAdminReviews();

  return <ReviewsClient initialReviews={reviews} />;
}
