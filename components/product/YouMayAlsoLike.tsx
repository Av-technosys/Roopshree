import { ProductCard } from "@/components/product/ProductCard"
import { type Product } from "@/components/global/const"
import { getRecommendedProducts } from "@/services/product.service"

const YouMayAlsoLike = async () => {
  const items = await getRecommendedProducts(5);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-semibold text-black">
          You May Also Like
        </h2>

        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5 md:gap-x-5">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product as Product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
