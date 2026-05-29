import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { getAddresses } from "@/helper/address/action"
import { getDashboardOrders } from "@/services/order.service"

export default async function Page() {
  const [addresses, orders] = await Promise.all([
    getAddresses(),
    getDashboardOrders(2),
  ])

  return <DashboardOverview addresses={addresses} orders={orders} />
}
