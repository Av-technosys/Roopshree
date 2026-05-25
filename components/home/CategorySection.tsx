import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    name: "Shrug",
    href: "/shop",
    image: "/home/shrug.png",
  },
  {
    name: "Brouch",
    href: "/shop",
    image: "/home/brouch.png",
  },
  {
    name: "Gottapatti",
    href: "/shop",
    image: "/home/gottpatti.png",
  },
  {
    name: "Zardozi",
    href: "/shop",
    image: "/home/zardozi.png",
  },
  {
    name: "Belbuti",
    href: "/shop",
    image: "/home/belbuti.png",
  },
]

const CategorySection = () => {
  return (
    <section className="bg-white py-7 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-[2.35rem] leading-tight text-black sm:text-5xl md:text-6xl">
            Every Dupatta, A Story of{" "}
            <span className="text-[#c39150]">Grace.</span>
          </h2>
          <p className="mt-4 text-base font-medium text-black sm:text-lg">
            Explore Our Collection
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-16 lg:grid-cols-5 lg:gap-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group block overflow-hidden"
              aria-label={`Explore ${category.name}`}
            >
              <Image
                src={category.image}
                alt={category.name}
                width={299}
                height={448}
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
