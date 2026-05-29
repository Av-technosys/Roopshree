"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import { DashboardPageTitle } from "@/components/dashboard/DashboardPrimitives"
import { formatPrice } from "@/components/global/const"
import { Button } from "@/components/ui/button"
import { useAddToCart } from "@/hooks/useAddToCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useWishlistStore } from "@/store/wishlistStore"

export function WishlistPage() {
  const wishlistProducts = useWishlistStore((state) => state.items)
  const { handleAddToCart } = useAddToCart()
  const { handleRemoveWishlist } = useWishlist()

  return (
    <div>
      <DashboardPageTitle>Wishlist</DashboardPageTitle>
      {wishlistProducts.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {wishlistProducts.map((product) => (
            <article key={product.productId} className="relative min-w-0 border p-4">
              <Link href="/shop" className="group block">
                <div className="relative aspect-[0.82] overflow-hidden bg-[#ead8c4]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1280px) 230px, (min-width: 640px) 40vw, 90vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <h2 className="mt-3 font-heading text-sm font-medium text-[#2d180f]">
                  {product.title}
                </h2>
                <p className="mt-1 text-xs font-medium text-[#C39150]">
                  {formatPrice(product.price)}
                </p>
              </Link>
              <button
                type="button"
                aria-label={`Remove ${product.title} from wishlist`}
                onClick={() => handleRemoveWishlist(product)}
                className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#C39150] shadow-sm transition hover:bg-white hover:text-[#3F2617]"
              >
                <Heart className="size-4" fill="currentColor" />
              </button>
              <div className="mt-3 grid gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    handleAddToCart(product)
                    handleRemoveWishlist(product)
                  }}
                  className="bg-[#3F2617] text-white hover:bg-[#2d180f]"
                >
                  <ShoppingCart className="size-4" />
                  Move to cart
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-[#2d180f]/70">
          Your wishlist is empty.
        </p>
      )}
    </div>
  )
}
