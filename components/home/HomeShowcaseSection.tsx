"use client"

import Image from "next/image"
import Link from "next/link"
import {
  formatPrice,
  productToCartItem,
  type Product,
} from "@/components/global/const"
import { ProductCard } from "@/components/product/ProductCard"

type HomeShowcaseSectionProps = {
  products?: Product[]
}

const HomeShowcaseSection = ({ products = [] }: HomeShowcaseSectionProps) => {

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center text-[#17110d]">
          <h2 className="font-heading font-semibold text-5xl leading-tight sm:text-5xl pb-10">
            Featured Products
          </h2>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}

      </div>
    </section>
  )
}

export default HomeShowcaseSection

