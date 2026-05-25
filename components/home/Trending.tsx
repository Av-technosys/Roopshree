import Image from "next/image"
import Link from "next/link"

const products = [
  {
    name: "Lagdi Patta Dupata",
    price: "₹1,850.00",
    image: "/home/new-arrival-model.png",
  },
  {
    name: "Lagdi Patta Saree",
    price: "₹1,850.00",
    image: "/home/gottpatti.png",
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

const Trending = () => {
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

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:mt-9 md:grid-cols-5 md:gap-x-5 md:gap-y-8">
            {products.map((product, index) => (
                <Link
                key={`${product.name}-${index}`}
                href="/shop"
                className="group block text-[#24150d]"
                >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eadb]">
                    <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                </div>
                <h3 className="mt-3 font-heading text-xs leading-snug text-[#3f2617] sm:mt-4 sm:text-sm">
                    {product.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#1d130f] sm:mt-2 sm:text-sm">
                    {product.price}
                </p>
                </Link>
            ))}
            </div>
        </div>
      </section>
  )}
  export default Trending