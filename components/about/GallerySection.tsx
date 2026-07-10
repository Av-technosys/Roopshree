"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { galleryItems } from "./about-data"

const GallerySection = () => {
  const extendedGalleryItems = [...galleryItems, ...galleryItems]

  return (
    <section className="bg-[#faf8f5] py-12 text-[#17110d] sm:py-16 lg:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl text-[#17110d]">
          Gallery
        </h2>
        <p className="mx-auto mt-4 max-w-[50rem] text-xs font-medium leading-relaxed text-[#17110d]/80 sm:text-sm md:text-base">
          Step into our gallery of timeless Bandhej artistry, showcasing handcrafted sarees and dupattas that beautifully blend traditional craftsmanship with modern elegance and refined luxury.
        </p>

        <div className="mt-12 px-2 sm:px-6 md:px-10">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="relative w-full group/carousel"
          >
            <CarouselContent className="-ml-4">
              {extendedGalleryItems.map((item, index) => (
                <CarouselItem
                  key={`${item.src}-${index}`}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="relative aspect-[4/5] overflow-hidden border-[6px] border-[#f3e6d5] bg-[#eadac6] shadow-sm transition-all duration-300 hover:border-[#eadac6]/80 hover:shadow-md group/card">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className={`object-cover transition-transform duration-700 ease-out group-hover/card:scale-105 ${item.className}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious 
              disabled={false}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/carousel:opacity-100 group-hover/carousel:pointer-events-auto transition-all duration-300 border-[#c39150] text-[#3f2617] bg-[#faf8f5]/90 hover:bg-[#c39150] hover:text-white hover:border-[#c39150] focus-visible:ring-0 focus-visible:outline-none focus:outline-none active:scale-95" 
            />
            <CarouselNext 
              disabled={false}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/carousel:opacity-100 group-hover/carousel:pointer-events-auto transition-all duration-300 border-[#c39150] text-[#3f2617] bg-[#faf8f5]/90 hover:bg-[#c39150] hover:text-white hover:border-[#c39150] focus-visible:ring-0 focus-visible:outline-none focus:outline-none active:scale-95" 
            />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default GallerySection




