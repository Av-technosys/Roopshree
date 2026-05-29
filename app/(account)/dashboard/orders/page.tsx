import { OrdersPage } from "@/components/dashboard/OrdersPage"
import { getDashboardOrders } from "@/services/order.service"

export default async function Page() {
  const orders = await getDashboardOrders()

  return <OrdersPage orders={orders} />
}
