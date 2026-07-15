import { type Product } from "@/components/global/const"
import { ProductCard } from "@/components/product/ProductCard"

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
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
