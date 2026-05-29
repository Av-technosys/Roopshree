import { DashboardPageTitle, FilterPill } from "@/components/dashboard/DashboardPrimitives"
import { OrderCard } from "@/components/dashboard/OrderCard"
import type { DashboardOrderCardView } from "@/services/order.service"

export function OrdersPage({ orders }: { orders: DashboardOrderCardView[] }) {
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
        {orders.length > 0 ? orders.map((order) => (
          <OrderCard
            key={order.slug}
            order={order}
            primaryAction={order.status === "Delivered" ? "Invoice" : "Track Order"}
            secondaryAction={order.status === "Delivered" ? "Review" : "View Details"}
          />
        )) : (
          <div className="border border-[#ead8c4] bg-white p-8 text-sm text-[#777]">
            No orders found.
          </div>
        )}
      </div>
    </div>
  )
}
