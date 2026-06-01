import { notFound, redirect } from "next/navigation"

import { OrderConfirmationPage } from "@/components/order/OrderConfirmationPage"
import { getCurrentSession } from "@/lib/auth"
import { getOrderConfirmationDetails } from "@/services/order.service"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/auth?callbackUrl=/order-confirmation")
  }

  const { orderId } = await searchParams

  if (!orderId) {
    redirect("/dashboard/orders")
  }

  const details = await getOrderConfirmationDetails(orderId)

  if (!details) {
    notFound()
  }

  return (
    <OrderConfirmationPage
      order={details.order}
      address={details.address}
      items={details.items}
    />
  )
}
