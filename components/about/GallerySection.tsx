import Image from "next/image"

import { galleryItems } from "./about-data"

const GallerySection = () => {
  return (
    <section className="bg-[#faf8f5] py-12 text-[#17110d] sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl leading-tight sm:text-4xl">
          Gallery
        </h2>
        <p className="mx-auto mt-3 max-w-[46rem] text-[0.62rem] font-medium leading-4 text-[#17110d]/80 sm:text-xs">
          Step into our gallery, a visual journey that celebrates how beautiful,
          vibrant, and graceful Bandhej traditional craftsmanship with modern
          elegance and refined luxury.
        </p>

        <div className="scrollbar-hidden mt-9 flex snap-x gap-4 overflow-x-auto sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible">
          {galleryItems.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="relative aspect-[4/5] w-64 shrink-0 snap-center overflow-hidden border-[5px] border-[#f3e6d5] bg-[#eadac6] sm:w-auto"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 640px) 20vw, 256px"
                className={`object-contain ${item.className}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
