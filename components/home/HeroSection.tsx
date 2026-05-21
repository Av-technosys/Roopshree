"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

const HeroSection = () => {
  return (
    <section className="relative isolate min-h-svh overflow-hidden bg-[#C39150]/10">
      <Image
        src="/hero-banner.png"
        alt="Bandhej saree collection"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-[58%_center] md:block"
      />
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/sm-herobanner.png"
          alt="Bandhej saree collection"
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[#C39150]/10 to-transparent md:hidden" />

      <div className="relative mx-auto flex min-h-svh max-w-7xl items-start justify-center px-5 pb-0 pt-20 sm:px-6 md:items-center md:justify-start md:py-20 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="mx-auto max-w-[20.5rem] text-center md:mx-0 md:max-w-xl md:text-left"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#C39150] md:mb-4 md:text-sm md:tracking-[0.32em]"
          >
            Timeless Tradition
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="text-[2.7rem] font-semibold leading-[0.9] text-[#3F2617] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Bandhej
            <span className="block text-[#C18F50]">Sarees</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-4 max-w-md text-xs leading-5 text-[#3F2617]/75 md:mx-0 md:mt-6 md:text-base md:leading-6"
          >
            <span className="md:hidden">
              Rooted in the vibrant culture of Rajasthan, Roopshree is a
              celebration of heritage, handcraft and timeless elegance.
            </span>
            <span className="hidden md:inline">
              Discover the art of Bandhej, where every knot tells a story of
              heritage and elegance.
            </span>
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mt-3 max-w-md text-xs leading-5 text-[#3F2617]/75 md:hidden"
          >
            Every piece we create is a blend of tradition, craftsmanship and
            feminine grace.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-5 flex justify-center md:mt-8 md:justify-start"
          >
            <Button
              asChild
              className="h-10 rounded-none bg-[#C39150] px-6 text-xs text-white shadow-lg shadow-[#3F2617]/15 hover:bg-[#3F2617] md:h-11 md:px-7 md:text-sm"
            >
              <Link href="/shop">
                <span className="md:hidden">Explore Collection</span>
                <span className="hidden md:inline">Shop Sarees</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
