"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import { formatPrice } from "@/components/global/const"
import { Button } from "@/components/ui/button"
import { useAddToCart } from "@/hooks/useAddToCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useWishlistStore } from "@/store/wishlistStore"

export function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items)
  const { handleAddToCart } = useAddToCart()
  const { handleRemoveWishlist } = useWishlist()

  return (
    <main className="flex-1 bg-white pb-20 pt-24 md:pt-20 ">
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-black">
          Wishlist
        </h1>

        {wishlistItems.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {wishlistItems.map((item) => (
              <article key={item.productId} className="relative min-w-0">
                <Link
                  href="/product/traditional-bandhej-saree"
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eadb]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 50vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <h2 className="mt-4 font-heading text-base leading-snug text-[#3f2617]">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-base font-medium text-[#c39150]">
                    {formatPrice(item.price)}
                  </p>
                </Link>
                <button
                  type="button"
                  aria-label={`Remove ${item.title} from wishlist`}
                  onClick={() => handleRemoveWishlist(item)}
                  className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#C39150] shadow-sm transition hover:bg-white hover:text-[#3F2617]"
                >
                  <Heart className="size-4" fill="currentColor" />
                </button>
                <div className="mt-3 grid gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      handleAddToCart(item)
                      handleRemoveWishlist(item)
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
          <p className="mt-8 text-sm text-[#3f2617]/70">
            Your wishlist is empty.
          </p>
        )}
      </section>
    </main>
  )
}
