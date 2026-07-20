"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  return (
    <section className="relative isolate mt-16 overflow-hidden bg-[#d6965f] md:mt-0 md:h-auto md:min-h-svh">
      <Image
        src="/new_banners/image 279.png"
        alt="Bandhej saree collection"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
      />
      <div className="relative aspect-[1023/1450] overflow-hidden md:hidden">
        <Image
          src="/new_banners/image 279.png"
          alt="Bandhej saree collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="pointer-events-none absolute -bottom-10 -right-10 z-[2] w-[72vw] max-w-[25rem] md:hidden">
        <Image
          src="/shop/sm-shop_bgoverlay.png"
          alt=""
          width={1024}
          height={1536}
          priority
          sizes="72vw"
          className="h-auto w-full"
        />
      </div>

      <div className="absolute inset-x-0 top-0 z-[3] mx-auto flex max-w-7xl items-start px-3.5 pb-10 pt-10 sm:px-6 md:relative md:min-h-svh md:items-center md:px-8 md:py-20 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="max-w-[17.25rem] text-left md:max-w-xl lg:max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-2 font-heading text-[0.64rem] uppercase tracking-[0.18em] text-white/80 md:mb-4 md:text-sm md:text-[#C39150] md:tracking-[0.32em]"
          >
            CATEGORIES
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="-ml-[0.1em] font-heading text-[2.65rem] leading-[0.9] text-[#C18F50] md:text-[#3F2617] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            BANDHEJ
            <span className="block font-heading italic text-white sm:text-5xl md:text-6xl md:text-[#C18F50] lg:text-8xl">
              Sarees
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-4 max-w-[16rem] text-[0.68rem] leading-[1.45] text-white md:mt-6 md:max-w-md md:text-base md:leading-6 md:text-[#535456]"
          >
            Timeless Bandhej sarees, crafted with intricate tie-dye techniques
            passed down through generations.
          </motion.p>

          {/* <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 max-w-[16.5rem] text-[0.68rem] leading-[1.45] text-white md:mt-6 md:max-w-xl md:text-base md:leading-6 md:text-[#6b6f72]"
          >
            Handcrafted by skilled artisans, each Bandhej saree blends timeless
            artistry, intricate patterns, and premium fabrics with Rajasthan’s
            rich heritage — creating elegant drapes perfect for weddings,
            festivities, and modern traditional styling.
          </motion.p> */}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
