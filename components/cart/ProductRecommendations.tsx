import Image from "next/image"
import Link from "next/link"

import { formatPrice, type Product } from "@/components/global/const"

export function ProductRecommendations({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16 lg:mt-19">
      <h2 className="text-center font-heading text-3xl font-semibold text-black md:text-[34px]">
        You may also like
      </h2>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/product/${product.slug}`}
            className="group block text-[#3F2617]"
          >
            <div className="relative aspect-[0.78] overflow-hidden bg-[#f7eadb]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 48vw"
                  className={`object-cover transition duration-500 group-hover:scale-[1.04] ${product.imageClass ?? "object-top"}`}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs font-medium text-[#3f2617]/70">
                  Product image coming soon
                </div>
              )}
            </div>
            <h3 className="mt-3 font-heading text-sm leading-snug">
              {product.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#C39150]">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
