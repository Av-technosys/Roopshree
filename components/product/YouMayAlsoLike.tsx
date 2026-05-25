import Image from "next/image"
import Link from "next/link"

const products = [
  {
    name: "Lagdi Patta Dupata",
    price: "₹1,850.00",
    image: "/home/belbuti.png",
  },
  {
    name: "Lagdi Patta Saree",
    price: "₹1,850.00",
    image: "/product/product_img.png",
  },
  {
    name: "Jaal Chunri With Pittan Work",
    price: "₹1,850.00",
    image: "/home/zardozi.png",
  },
  {
    name: "Radiant Peal Satin Tissue Saree",
    price: "₹1,850.00",
    image: "/home/shrug.png",
  },
  {
    name: "Lagdi Patta Dupata",
    price: "₹1,850.00",
    image: "/home/belbuti.png",
  },
]

const YouMayAlsoLike = () => {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-xl font-semibold text-black">
          You May Also Like
        </h2>

        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5 md:gap-x-5">
          {products.map((product, index) => (
            <Link
              key={`${product.name}-${index}`}
              href="/product/traditional-bandhej-saree"
              className="group block text-[#24150d]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eadb]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 font-heading text-sm leading-snug text-[#3f2617]">
                {product.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#c39150]">
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default YouMayAlsoLike
