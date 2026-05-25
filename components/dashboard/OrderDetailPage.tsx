import { notFound } from "next/navigation"

import {
  DashboardCard,
  DashboardPageTitle,
} from "@/components/dashboard/DashboardPrimitives"
import {
  defaultAddress,
  orderSummary,
  recentOrders,
} from "@/components/dashboard/dashboard-data"
import { OrderCard } from "@/components/dashboard/OrderCard"

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const order = recentOrders.find((item) => item.slug === orderId)

  if (!order) {
    notFound()
  }

  return (
    <div>
      <DashboardPageTitle>Recent Orders</DashboardPageTitle>

      <DashboardCard className="mt-5 grid gap-8 p-5 md:grid-cols-3">
        <div>
          <h2 className="text-sm font-semibold text-black">Order Summary</h2>
          <div className="mt-3 space-y-2 text-xs">
            {orderSummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-[#555]">{item.label}</span>
                <span className={item.strong ? "font-semibold text-black" : ""}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-black">Payment Method</h2>
          <p className="mt-2 text-sm font-semibold text-black">
            Cash on Delivery (COD)
          </p>
        </div>

        <div className="md:text-right">
          <h2 className="text-sm font-semibold text-black">Address</h2>
          <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
            {defaultAddress.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#eef5ff] px-3 py-1 text-[10px] font-semibold text-[#2974e6]"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold">{defaultAddress.name}</p>
          <p className="mt-2 text-xs leading-5 text-[#555]">
            {defaultAddress.address}
          </p>
        </div>
      </DashboardCard>

      <div className="mt-5">
        <OrderCard order={order} />
      </div>
    </div>
  )
}
