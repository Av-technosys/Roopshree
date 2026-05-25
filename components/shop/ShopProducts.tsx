"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { ShopMobileFilters } from "./ShopFilters"

const categories = [
  { name: "Shrug", image: "/home/shrug.png" },
  { name: "Gottapatti", image: "/home/gottapatti.png" },
  { name: "Zardozi", image: "/home/zardozi.png" },
  { name: "Brouch", image: "/home/brouch.png" },
  { name: "Zardozi", image: "/home/zardozi.png" },
  { name: "Gottapatti", image: "/home/gottapatti.png" },
  { name: "Zardozi", image: "/home/zardozi.png" },
]

type Product = {
  id: number
  name: string
  price: string
  image: string
  imageClass: string
}

const productDetails: Product[] = [
  {
    id: 1,
    name: "Lagdi Patta Dupata",
    price: "₹1,850.00",
    image: "/shop/sm-shop_bg.png",
    imageClass: "object-[50%_58%]",
  },
  {
    id: 2,
    name: "Lagdi Patta Saree",
    price: "₹1,850.00",
    image: "/shop/sm-shop_bg.png",
    imageClass: "object-[55%_55%]",
  },
  {
    id: 3,
    name: "Jaal Chunri With Pittan Work",
    price: "₹1,850.00",
    image: "/shop/shop_bg.png",
    imageClass: "object-[68%_58%]",
  },
  {
    id: 4,
    name: "Radiant Peal Satin Tissue Saree",
    price: "₹1,850.00",
    image: "/shop/shop_bg.png",
    imageClass: "object-[82%_50%]",
  },
]

const pageSize = 12
const totalPages = 70

export default function ShopProducts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("Featured")
  const [activeCategory, setActiveCategory] = useState(0)

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return Array.from({ length: pageSize }, (_, index) => {
      const id = start + index + 1
      const source = productDetails[(id - 1) % productDetails.length]
      return {
        ...source,
        id,
      }
    })
  }, [currentPage])

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
  }

  return (
    <section className="relative min-w-0 max-w-full overflow-hidden">
      <div className="hidden justify-end lg:absolute lg:right-0 lg:-top-[3.25rem] lg:flex">
        <SortControl sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <h2 className="mb-4 text-sm font-medium text-[#111] lg:hidden">
        All Categories
      </h2>

      <div className="scrollbar-hidden flex max-w-full gap-4 overflow-x-auto pb-2 lg:gap-5">
        {categories.map((category, index) => (
          <button
            key={`${category.name}-${index}`}
            type="button"
            onClick={() => setActiveCategory(index)}
            className="w-[88px] shrink-0 text-center sm:w-[104px] lg:w-[120px]"
          >
            <span
              className={`relative mx-auto block size-[88px] overflow-hidden rounded-full border-2 transition sm:size-[104px] lg:size-[120px] ${
                activeCategory === index
                  ? "border-[#c39150]"
                  : "border-transparent"
              }`}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(min-width: 1024px) 120px, (min-width: 640px) 104px, 88px"
                className="object-cover object-top"
              />
            </span>
            <span
              className={`mt-3 block font-heading text-sm leading-none ${
                activeCategory === index ? "text-[#c39150]" : "text-[#3F2617]"
              }`}
            >
              {category.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between lg:hidden">
        <ShopMobileFilters />
        <SortControl sortBy={sortBy} onSortChange={setSortBy} compact />
      </div>

      <h2 className="mt-7 hidden text-sm font-semibold text-[#111] lg:block">
        All Products (69)
      </h2>

      <div className="mt-6 grid min-w-0 grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:mt-4 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 hidden items-center justify-end gap-2 text-xs text-[#3F2617] lg:flex">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`size-6 rounded-[2px] border text-xs ${
              page === currentPage
                ? "border-[#c39150] bg-[#c39150] text-white"
                : "border-[#d8a15a] bg-white text-[#3F2617]"
            }`}
          >
            {page}
          </button>
        ))}
        <span>........</span>
        <button
          type="button"
          onClick={() => goToPage(totalPages)}
          className={`h-6 min-w-7 rounded-[2px] border px-1 ${
            currentPage === totalPages
              ? "border-[#c39150] bg-[#c39150] text-white"
              : "border-[#d8a15a] bg-white text-[#3F2617]"
          }`}
        >
          {totalPages}
        </button>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  )
}

function SortControl({
  sortBy,
  onSortChange,
  compact = false,
}: {
  sortBy: string
  onSortChange: (value: string) => void
  compact?: boolean
}) {
  return (
    <label
      className={`flex items-center gap-2 self-start text-[#111] ${
        compact ? "text-sm font-semibold" : "text-xs"
      }`}
    >
      Sort by:
      <select
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
        className={`rounded-[2px] border border-[#d8a15a] bg-white px-3 font-normal text-[#c39150] outline-none ${
          compact ? "h-9 w-[92px] text-xs" : "h-8 min-w-28 text-xs"
        }`}
      >
        <option>Featured</option>
        <option>Newest</option>
        <option>Price Low</option>
      </select>
    </label>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[0.75] overflow-hidden bg-[#f8efe6] md:aspect-[0.78]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 220px, (min-width: 768px) 28vw, 48vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.04] ${product.imageClass}`}
        />
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex size-8 translate-y-2 items-center justify-center rounded-full bg-[#c39150] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Heart className="size-4" />
        </button>
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="h-10 w-full rounded-[4px] bg-[#c39150] text-sm font-semibold tracking-[0.12em] text-white shadow-lg shadow-black/10"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <Link href="/product/traditional-bandhej-saree" className="block">
        <h3 className="mt-3 font-heading text-[15px] leading-snug text-[#3F2617] md:text-sm">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#111] md:text-xs md:text-[#c39150]">
          {product.price}
        </p>
      </Link>
    </article>
  )
}
