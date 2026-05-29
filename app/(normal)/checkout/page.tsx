import { redirect } from "next/navigation"

import { CheckoutPage } from "@/components/checkout/CheckoutPage"
import { getAddresses } from "@/helper/address/action"
import { getCurrentSession } from "@/lib/auth"

export default async function Page() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/auth?callbackUrl=/checkout")
  }

  const addresses = await getAddresses()

  return <CheckoutPage addresses={addresses} />
}
