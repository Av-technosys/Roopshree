"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const colors = [
  {
    name: "Red",
    image: "/product/color1.png",
    mainImage: "/product/product_img.png",
  },
  {
    name: "Rani Pink",
    image: "/product/color2.png",
    mainImage: "/product/color2.png",
  },
  {
    name: "Green",
    image: "/product/color3.png",
    mainImage: "/product/color3.png",
  },
  {
    name: "Wine",
    image: "/product/color4.png",
    mainImage: "/product/color4.png",
  },
]

const galleryImages = [
  {
    src: "/product/product_img.png",
    alt: "Front view of red Bandhej saree",
  },
  {
    src: "/home/shrug.png",
    alt: "Bandhej fabric detail",
  },
  {
    src: "/home/zardozi.png",
    alt: "Bandhej handwork border detail",
  },
  {
    src: "/home/brouch.png",
    alt: "Bandhej styling detail",
  },
]

const breadcrumbs = ["Home", "Categories", "Products", "Product Details"]

const ProductDetails = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<
    (typeof galleryImages)[number] | null
  >(null)
  const displayedImage = selectedGalleryImage?.src ?? selectedColor.mainImage
  const displayedAlt =
    selectedGalleryImage?.alt ??
    `Traditional Bandhej Saree in ${selectedColor.name}`

  return (
    <section className="bg-white pb-14 pt-24 text-[#111] md:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold text-black">
          {breadcrumbs.map((item, index) => (
            <span key={item} className="inline-flex items-center gap-2">
              {index === 0 ? <Link href="/">Home</Link> : item}
              <span className="text-[#3f2617]">&gt;</span>
            </span>
          ))}
        </nav>

        <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
          <div className="min-w-0">
            <div className="relative aspect-[0.83] overflow-hidden bg-[#f2e4d7] sm:aspect-[0.78] lg:aspect-[0.83]">
              <Image
                src={displayedImage}
                alt={displayedAlt}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover object-top"
              />
            </div>

            <div className="mt-7 flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous product image"
                className="hidden text-[#c39150] md:block"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="grid flex-1 grid-cols-4 gap-3 sm:gap-5">
                {galleryImages.map((image) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setSelectedGalleryImage(image)}
                    className={`relative aspect-[0.78] overflow-hidden border transition ${
                      displayedImage === image.src
                        ? "border-[#c39150]"
                        : "border-transparent"
                    }`}
                    aria-label="View product image"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 130px, 24vw"
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Next product image"
                className="hidden text-[#c39150] md:block"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="min-w-0 lg:pt-1">
            <h1 className="max-w-2xl font-heading text-[2rem] leading-[1.18] text-black md:text-[2.45rem]">
              Tradational Bandhej Saree with Lagdi Patta Saree
            </h1>
            <p className="mt-5 text-xs font-semibold uppercase text-black">
              SKU: RNPE-SAREE
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-4">
              <p className="text-3xl font-bold text-black md:text-4xl">
                ₹4,850
              </p>
              <p className="text-xl text-[#5f5a55] line-through">₹6,500</p>
              <p className="text-xl text-[#c39150]">(25% OFF)</p>
            </div>

            <p className="mt-7 max-w-[35rem] text-sm  leading-5 text-black">
              Modal silk is a premium fabric known for its smooth and lustrous
              texture. A Modal silk Bandhej piece is timeless, elegant, and
              deeply rooted in tradition. It is traditionally woven in Gujarat
              and Rajasthan. The fabric is strong, durable, and has a rich
              glossy finish.
            </p>

            <div className="mt-7">
              <p className="text-xs font-bold uppercase text-black">
                Colour: {selectedColor.name}
              </p>
              <div className="mt-4 flex gap-4">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color)
                      setSelectedGalleryImage(null)
                    }}
                    className={`relative h-24 w-20 overflow-hidden border transition md:h-[7.4rem] md:w-[6.1rem] ${
                      selectedColor.name === color.name
                        ? "border-[#c39150]"
                        : "border-transparent"
                    }`}
                    aria-label={`Choose ${color.name}`}
                  >
                    <Image
                      src={color.image}
                      alt={`${color.name} saree color`}
                      fill
                      sizes="100px"
                      className="object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block text-xs font-medium uppercase text-black">
                Fabric
                <select className="mt-3 h-12 w-full rounded-none border border-[#d8b278] bg-white px-4 text-sm font-medium text-black outline-none">
                  <option>Silk</option>
                </select>
              </label>

              <label className="block text-xs font-medium uppercase text-black">
                Size
                <select className="mt-3 h-12 w-full rounded-none border border-[#d8b278] bg-white px-4 text-sm font-medium text-black outline-none">
                  <option>Saree 5.5 mtr with Blouse 0.8 mtr</option>
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-2">
              <Button className="h-12 rounded-none bg-[#c39150] text-sm font-semibold text-white hover:bg-[#3f2617]">
                Add to cart
              </Button>
              <Button className="h-12 rounded-none bg-[#3f2617] text-sm font-semibold text-white hover:bg-[#c39150]">
                Buy Now
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 rounded-none border-[#d8b278] bg-white text-sm font-medium text-[#3f2617] hover:bg-[#fbf3ea]"
              >
                <Heart className="size-4 text-[#c39150]" />
                Add to Wishlist
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-none border-[#d8b278] bg-white text-sm font-medium text-[#3f2617] hover:bg-[#fbf3ea]"
              >
                <Share2 className="size-4 text-[#c39150]" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
