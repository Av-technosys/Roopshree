import { redirect } from "next/navigation"

import { WishlistPage } from "@/components/wishlist/WishlistPage"
import { getCurrentSession } from "@/lib/auth"

export default async function Page() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/auth?callbackUrl=/wishlist")
  }

  return <WishlistPage />
}
