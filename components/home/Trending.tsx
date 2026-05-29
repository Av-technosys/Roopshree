import Image from "next/image"
import Link from "next/link"

import { formatPrice } from "@/components/global/const"
import type { Product } from "@/components/global/const"

const Trending = ({ products: fetchedProducts }: { products?: Product[] }) => {
  const productItems = fetchedProducts ?? []

  return (
    <section className="bg-white">

        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 md:py-20 lg:px-8">
            <div className="text-center text-[#17110d]">
            <h2 className="font-heading text-2xl leading-tight sm:text-4xl">
                Trending Collection
            </h2>
            <p className="mx-auto mt-2 max-w-[18rem] text-[0.62rem] font-medium leading-4 sm:max-w-none sm:text-xs">
                Our Best-Selling Bandhej, Loved Across Generations
            </p>
            </div>

            {productItems.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:mt-9 md:grid-cols-5 md:gap-x-5 md:gap-y-8">
            {productItems.map((product) => (
                <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="group block text-[#24150d]"
                >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eadb]">
                  {product.image ? (
                    <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs font-medium text-[#3f2617]/70">
                      Product image coming soon
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-heading text-xs leading-snug text-[#3f2617] sm:mt-4 sm:text-sm">
                    {product.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#1d130f] sm:mt-2 sm:text-sm">
                    {formatPrice(product.price)}
                </p>
                </Link>
            ))}
              </div>
            ) : null}
        </div>
      </section>
  )}
  export default Trending
