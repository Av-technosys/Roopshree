import Image from "next/image"
import Link from "next/link"

const wishlistItems = [
  {
    name: "Lagdi Patta Dupata",
    price: "₹1,850.00",
    image: "/home/belbuti.png",
  },
  {
    name: "Lagdi Patta Dupata",
    price: "₹1,850.00",
    image: "/home/belbuti.png",
  },
]

const Page = () => {
  return (
    <main className="flex-1 bg-white pb-20 pt-24 md:pt-20">
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-black">
          Wishlist
        </h1>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {wishlistItems.map((item, index) => (
            <Link
              key={`${item.name}-${index}`}
              href="/product/traditional-bandhej-saree"
              className="block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eadb]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <h2 className="mt-4 font-heading text-base leading-snug text-[#3f2617]">
                {item.name}
              </h2>
              <p className="mt-1 text-base font-medium text-[#c39150]">
                {item.price}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Page
