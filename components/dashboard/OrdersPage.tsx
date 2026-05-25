import { DashboardPageTitle, FilterPill } from "@/components/dashboard/DashboardPrimitives"
import { recentOrders } from "@/components/dashboard/dashboard-data"
import { OrderCard } from "@/components/dashboard/OrderCard"

export function OrdersPage() {
  return (
    <div>
      <DashboardPageTitle>Recent Orders</DashboardPageTitle>
      <div className="mt-5 flex flex-wrap gap-3">
        <FilterPill active>All</FilterPill>
        <FilterPill>Delivered</FilterPill>
        <FilterPill>Shipped</FilterPill>
        <FilterPill>Pending</FilterPill>
      </div>
      <div className="mt-5 space-y-5">
        {recentOrders.map((order, index) => (
          <OrderCard
            key={`${order.slug}-${index}`}
            order={order}
            primaryAction={order.status === "Delivered" ? "Invoice" : "Track Order"}
            secondaryAction={order.status === "Delivered" ? "Review" : "View Details"}
          />
        ))}
      </div>
    </div>
  )
}
