import { ReviewsPage } from "@/components/dashboard/ReviewsPage"
import { getDashboardReviewData } from "@/services/review.service"

export default async function Page() {
  const reviewData = await getDashboardReviewData()

  return <ReviewsPage reviewData={reviewData} />
}
