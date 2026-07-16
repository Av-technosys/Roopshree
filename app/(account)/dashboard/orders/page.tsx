import { OrdersPage } from "@/components/dashboard/OrdersPage"
import { DashboardOrdersSkeleton } from "@/components/dashboard/DashboardSkeletons"
import { getDashboardOrders } from "@/services/order.service"
import { Suspense } from "react"

async function OrdersContent() {
  const orders = await getDashboardOrders()

  return <OrdersPage orders={orders} />
}

export default function Page() {
  return (
    <Suspense fallback={<DashboardOrdersSkeleton />}>
      <OrdersContent />
    </Suspense>
  )
}
