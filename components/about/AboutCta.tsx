import Link from "next/link"

import { Button } from "@/components/ui/button"

const AboutCta = () => {
  return (
    <section className="bg-[#faf8f5] pb-14 text-center text-[#17110d] sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl leading-tight sm:text-4xl">
          Experience the Art of Bandhej
        </h2>
        <p className="mx-auto mt-3 max-w-[42rem] text-[0.62rem] font-medium leading-4 text-[#17110d]/80 sm:text-xs">
          Explore our curated collection of hand-tied scarves and dupattas,
          where tradition meets contemporary luxury.
        </p>

        <Button
          asChild
          className="mt-8 h-11 rounded-[2px] bg-[#c39150] px-10 text-xs font-semibold text-white shadow-none hover:bg-[#3f2617] sm:h-12 sm:min-w-[17rem] sm:px-12 sm:text-sm"
        >
          <Link href="/shop">Shop the Collection</Link>
        </Button>
      </div>
    </section>
  )
}

export default AboutCta
