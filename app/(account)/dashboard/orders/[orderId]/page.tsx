import { OrderDetailPage } from "@/components/dashboard/OrderDetailPage"
import { getDashboardOrderDetails } from "@/services/order.service"

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const details = await getDashboardOrderDetails(orderId)

  return <OrderDetailPage details={details} />
}
