import Image from "next/image"
import Link from "next/link"

import { DashboardPageTitle } from "@/components/dashboard/DashboardPrimitives"
import { wishlistProducts } from "@/components/dashboard/dashboard-data"

export function WishlistPage() {
  return (
    <div>
      <DashboardPageTitle>Wishlist</DashboardPageTitle>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistProducts.map((product) => (
          <Link key={product.id} href="/shop" className="group block">
            <div className="relative aspect-[0.82] overflow-hidden bg-[#ead8c4]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 230px, (min-width: 640px) 40vw, 90vw"
                className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <h2 className="mt-3 font-heading text-sm font-medium text-[#2d180f]">
              {product.name}
            </h2>
            <p className="mt-1 text-xs font-medium text-[#C39150]">
              {product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
