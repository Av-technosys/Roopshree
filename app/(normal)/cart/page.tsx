import { redirect } from "next/navigation"

import { CartPage } from "@/components/cart/CartPage"
import { getCurrentSession } from "@/lib/auth"
import { getRecommendedProducts } from "@/services/product.service"

export default async function Page() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/auth?callbackUrl=/cart")
  }

  const recommendedProducts = await getRecommendedProducts(5)

  return <CartPage recommendedProducts={recommendedProducts} />
}
