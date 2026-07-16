import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { getUserWishlistCount } from "@/actions/wishlist.action"
import { getAddresses } from "@/helper/address/action"
import {
  getDashboardOrderCount,
  getDashboardOrders,
} from "@/services/order.service"
import { getDashboardReviewCount } from "@/services/review.service"
import { DashboardOverviewSkeleton } from "@/components/dashboard/DashboardSkeletons"
import { Suspense } from "react"

async function DashboardOverviewContent() {
  const [addresses, orders, orderCount, wishlistCount, reviewCount] = await Promise.all([
    getAddresses(),
    getDashboardOrders(2),
    getDashboardOrderCount(),
    getUserWishlistCount(),
    getDashboardReviewCount(),
  ])

  return (
    <DashboardOverview
      addresses={addresses}
      orders={orders}
      orderCount={orderCount}
      wishlistCount={wishlistCount}
      reviewCount={reviewCount}
    />
  )
}

export default function Page() {
  return (
    <Suspense fallback={<DashboardOverviewSkeleton />}>
      <DashboardOverviewContent />
    </Suspense>
  )
}
