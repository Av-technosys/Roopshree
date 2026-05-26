"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  LockKeyhole,
  Truck,
} from "lucide-react"
import { Card } from "../ui/card"

const collections = [
  "Renial brooch Dupata With Krishna Buta",
  "Renial brooch Dupata With Krishna Buta",
  "Renial brooch Dupata With Krishna Buta",
  "Renial brooch Dupata With Krishna Buta",
]

const benefits = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "With Love & Tradition",
  },
  {
    icon: BadgeCheck,
    title: "Premium Quality",
    description: "Finest Fabrics",
  },
  {
    icon: Leaf,
    title: "Natural Dyes",
    description: "Eco-Friendly Colours",
  },
  {
    icon: LockKeyhole,
    title: "Secure Payment",
    description: "Fast & Secure",
  },
]

const HomeShowcaseSection = () => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push("/shop")
  }

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center text-[#17110d]">
            <h2 className="font-heading text-2xl leading-tight sm:text-4xl pb-10">
                Spotlight
            </h2>
            </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {collections.map((title, index) => (
            <Card
              key={`${title}-${index}`}
              onClick={handleCardClick}
              className="group relative aspect-square overflow-hidden rounded-[4px] border border-[#ead8c5]  transition duration-300 hover:border-[#c39150]/70 cursor-pointer"
            >
              <div className="absolute bottom-[22%] left-[6.4%] top-[27%] z-10 flex w-[58%] flex-col">
                <Image
                  src="/about/timelesselegance.png"
                  alt=""
                  width={83}
                  height={67}
                  className="mb-[6%] h-3.5 w-4 object-contain sm:h-7 sm:w-8 md:h-4 md:w-5 lg:h-5 lg:w-6 xl:h-6 xl:w-7"
                />
                <h2 className="font-heading text-[clamp(0.5rem,3vw,1.35rem)] leading-[1.28] text-[#3f2617] text-pretty sm:text-[clamp(1.1rem,2.7vw,1.45rem)] md:text-[clamp(0.68rem,1.32vw,0.9rem)] lg:text-[clamp(0.86rem,1.2vw,1.08rem)] xl:text-[clamp(0.95rem,1.03vw,1.1rem)]">
                  {title}
                </h2>
                <span className="mt-auto inline-flex items-center gap-1.5 text-xs text-[#3f2617] sm:gap-4 sm:text-sm md:gap-2 md:text-[0.68rem] lg:gap-3 lg:text-sm xl:gap-4 xl:text-[0.95rem]">
                  Explore Now
                  <ArrowRight className="size-2 text-[#c39150] transition-transform duration-300 group-hover:translate-x-1 sm:size-4 md:size-3 lg:size-4" />
                </span>
              </div>

              <Image
                src="/home/showcase.png"
                alt={title}
                width={198}
                height={329}
                sizes="(min-width: 1280px) 185px, (min-width: 640px) 215px, 190px"
                className="absolute bottom-0 right-[-7%] top-0 h-full w-auto max-w-none object-contain object-right opacity-95 sm:right-[-3%] xl:right-[-8%]"
              />
            </Card>
          ))}
        </div>

        <div className="mt-5 grid gap-x-8 gap-y-8 rounded-[4px] border border-[#ead8c5] bg-[#fcf8f1] px-8 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-center gap-5 text-[#3f2617]"
            >
              <Icon className="size-9 shrink-0 text-[#c39150]" />
              <div>
                <h3 className="font-heading text-base uppercase leading-tight  xl:text-sm">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-[#3f2617]/90">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeShowcaseSection
