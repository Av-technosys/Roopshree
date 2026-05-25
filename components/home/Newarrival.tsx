import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Flower2 } from "lucide-react"

import { Button } from "@/components/ui/button"

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

const Newarrival = () => {
  return (
    <section className="bg-white">
      <div className="relative isolate overflow-hidden bg-[#f8ead7] md:aspect-[2/1]">
        <Image
          src="/home/newarrival_bg.png"
          alt="Woman styling a red Bandhej dupatta"
          fill
          sizes="100vw"
          priority={false}
          className="hidden object-contain object-center md:block"
        />
        <Image
          src="/home/sm-newarrival_bg.png"
          alt="Woman styling a red Bandhej dupatta"
          width={852}
          height={1846}
          sizes="100vw"
          className="block h-auto w-full md:hidden"
        />

        <div className="absolute inset-x-0 top-[2.7%] mx-auto flex justify-center px-2 md:inset-0 md:top-0 md:justify-end md:px-[5.8vw] md:pt-[4.5vw]">
          <div className="w-full max-w-[27rem] text-center text-[#3f2617] sm:max-w-md md:max-w-[47vw]">
            <div className="flex items-center justify-center gap-4 text-[#9d6b32] md:gap-8">
              <span className="h-px w-20 bg-[#9d6b32]/50 md:w-[8.6vw] md:bg-linear-to-r md:from-transparent md:to-[#3f2617]" />
              <div className="flex shrink-0 flex-col items-center gap-1 md:gap-2">
                <Flower2 className="size-6 md:size-10" strokeWidth={1.4} />
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] md:text-[1.35vw] md:tracking-[0.34em]">
                  New Arrival
                </span>
              </div>
              <span className="h-px w-20 bg-[#9d6b32]/50 md:w-[8.6vw] md:bg-linear-to-l md:from-transparent md:to-[#3f2617]" />
            </div>

            <h2 className="mt-7 font-heading text-[clamp(3.65rem,16vw,4.45rem)] leading-[0.86] text-[#3f2617] sm:mt-6 sm:text-7xl md:mt-[3.5vw] md:text-[clamp(5rem,7.15vw,9rem)] md:leading-[1.04]">
              <span className="block -translate-x-[7%] md:-translate-x-[5%]">
                BANDHEJ
              </span>
              <span className="block translate-x-[6%] font-semibold md:translate-x-[4%]">
                DUPATTAS
              </span>
            </h2>
            <div className="mx-auto mt-3 flex w-48 items-center justify-center gap-2 text-[#c39150] md:mt-[1.7vw] md:w-[18vw] md:max-w-80 md:gap-3">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#c39150]" />
              <span className="size-2 rotate-45 bg-[#c39150] md:size-3" />
              <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#c39150]" />
            </div>
            <p className="mx-auto mt-5 max-w-[18rem] text-poppins font-semibold leading-6 text-[#1d130f] md:mt-[1.8vw] md:max-w-[28vw] md:text-[1.2vw] md:leading-[1.28]">
              Crafted with tradition, styled for today.
            </p>
            <Button
              asChild
              className="mt-5 h-10 rounded-[2px] bg-[#c39150] px-10 text-xs font-semibold text-white shadow-none hover:bg-[#3f2617] md:mt-[2.45vw] md:h-[3.5vw] md:min-h-14 md:min-w-[21vw] md:px-[3vw] md:text-[1.2vw]"
            >
              <Link href="/shop">
                Shop This Look
                <ArrowRight className="size-4 md:size-6" />
              </Link>
            </Button>
            <Link
              href="/shop"
              className="mx-auto mt-4 block w-fit text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#3f2617] transition hover:text-[#c39150] md:mt-[1.45vw] md:text-[0.95vw] md:tracking-[0.18em]"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:pt-20 pb-10 lg:px-8">
        <div className="text-center text-[#17110d]">
          <h2 className="font-heading text-2xl leading-tight sm:text-4xl">
            New Arrival
          </h2>
          <p className="mx-auto mt-2 max-w-[18rem] text-[0.62rem] font-medium leading-4 sm:max-w-none sm:text-xs">
            Step into the Season With Our Latest Bandhej Creations
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
  )
}

export default Newarrival
