"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  Trash2,
} from "lucide-react"

import { formatPrice } from "@/components/global/const"
import { Button } from "@/components/ui/button"
import { useAddToCart } from "@/hooks/useAddToCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import type { CartItemInput } from "@/store/cartTypes"

export type ProductDetailView = {
  id: string
  slug: string
  name: string
  sku: string
  description: string
  short_description: string
  price: number
  strikeThroughPrice: number | null
  variants: {
    id: string
    title: string
    sku: string
    price: number
    strikeThroughPrice: number | null
    stockQuantity: number
    color: string | null
    fabric: string | null
    size: string | null
    isDefault: boolean
    rating: number
    reviewCount: number
    image: string
  }[]
  media: {
    id: string
    src: string
    alt: string
    variantId: string
    isPrimary: boolean
  }[]
  attributes: {
    id: string
    name: string
    value: string
  }[]
  reviews: {
    id: string
    rating: number
    title: string
    message: string
    reviewerName: string
    createdAt: string
  }[]
  reviewSummary: {
    averageRating: number
    reviewCount: number
    ratingRows: {
      rating: number
      percent: number
    }[]
  }
}

const breadcrumbs = ["Home", "Categories", "Products", "Product Details"]

const ProductDetails = ({ product }: { product: ProductDetailView }) => {
  const router = useRouter()
  const {
    handleAddToCart,
    handleDecreaseCartItem,
    handleIncreaseCartItem,
    handleRemoveCartItem,
  } = useAddToCart()
  const { handleToggleWishlist } = useWishlist()
  const defaultVariant =
    product.variants.find((variant) => variant.isDefault) ??
    product.variants[0] ??
    null
  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id ?? ""
  )
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ??
    defaultVariant
  const selectedMedia =
    product.media.find((item) => item.id === selectedMediaId) ??
    product.media.find((item) => item.variantId === selectedVariant?.id) ??
    product.media.find(
      (item) => item.variantId === defaultVariant?.id && item.isPrimary
    ) ??
    product.media[0] ??
    null
  const selectedVariantMedia = product.media.filter(
    (item) => item.variantId === selectedVariant?.id
  )
  const galleryMedia = selectedVariantMedia.length
    ? selectedVariantMedia
    : product.media.filter((item) => item.variantId === defaultVariant?.id)
  const displayedImage = selectedMedia?.src ?? selectedVariant?.image ?? ""
  const displayedAlt = selectedMedia?.alt ?? product.name
  const price = selectedVariant?.price ?? product.price
  const strikeThroughPrice =
    selectedVariant?.strikeThroughPrice ?? product.strikeThroughPrice
  const discount =
    strikeThroughPrice && strikeThroughPrice > price
      ? Math.round(((strikeThroughPrice - price) / strikeThroughPrice) * 100)
      : null
  const variantAttributes = useMemo(
    () =>
      [
        selectedVariant?.color
          ? { name: "Colour", value: selectedVariant.color }
          : null,
        selectedVariant?.fabric
          ? { name: "Fabric", value: selectedVariant.fabric }
          : null,
        selectedVariant?.size
          ? { name: "Size", value: selectedVariant.size }
          : null,
      ].filter(Boolean) as { name: string; value: string }[],
    [selectedVariant]
  )
  const cartItem: CartItemInput = {
    productId: `${product.slug}:${selectedVariant?.id ?? "default"}`,
    dbProductId: product.id,
    variantId: selectedVariant?.id,
    title: product.name,
    price,
    stockQuantity: selectedVariant?.stockQuantity,
    image: displayedImage,
    colour: selectedVariant?.color ?? undefined,
    imageClass: "object-top",
    attributes: variantAttributes.length ? variantAttributes : undefined,
  }
  const cartQuantity = useCartStore(
    (state) =>
      state.getItemQuantity(
        cartItem.productId,
        cartItem.attributes,
        cartItem.variantId
      )
  )
  const isInCart = cartQuantity > 0
  const isWishlisted = useWishlistStore((state) =>
    state.hasItem(cartItem.productId, cartItem.dbProductId)
  )

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
              {displayedImage ? (
                <Image
                  src={displayedImage}
                  alt={displayedAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm font-medium text-[#3f2617]/70">
                  Product image coming soon
                </div>
              )}
            </div>

            {galleryMedia.length > 0 ? (
              <div className="mt-7 flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Previous product image"
                  className="hidden text-[#c39150] md:block"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <div className="grid flex-1 grid-cols-4 gap-3 sm:gap-5">
                  {galleryMedia.slice(0, 4).map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedMediaId(image.id)}
                      className={`relative aspect-[0.78] overflow-hidden border transition ${selectedMedia?.id === image.id
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
            ) : null}
          </div>

          <div className="min-w-0 lg:pt-1">
            <h1 className="max-w-2xl font-heading text-[2rem] leading-[1.18] text-black md:text-[2.45rem]">
              {product.name}
            </h1>
            <p className="mt-5 text-xs font-semibold uppercase text-black">
              SKU: {selectedVariant?.sku ?? product.sku}
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-4">
              <p className="text-3xl font-bold text-black md:text-4xl">
                {formatPrice(price)}
              </p>
              {strikeThroughPrice ? (
                <p className="text-xl text-[#5f5a55] line-through">
                  {formatPrice(strikeThroughPrice)}
                </p>
              ) : null}
              {discount ? (
                <p className="text-xl text-[#c39150]">({discount}% OFF)</p>
              ) : null}
            </div>

            {product.short_description ? (
              <p className="mt-7 max-w-[35rem] text-sm leading-5 text-black whitespace-pre-wrap">
                {product.short_description}
              </p>
            ) : null}

            {product.variants.length > 0 ? (
              <div className="mt-7">
                <p className="text-xs font-bold uppercase text-black">
                  Colour: {selectedVariant?.color ?? selectedVariant?.title}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(variant.id)
                        setSelectedMediaId(null)
                      }}
                      className={`overflow-hidden rounded-[3px] border bg-white text-left transition ${selectedVariant?.id === variant.id
                          ? "border-[#c39150] shadow-sm"
                          : "border-[#d8b278] hover:border-[#c39150]"
                        }`}
                    >
                      <span className="relative block aspect-[0.78] bg-[#f8efe6]">
                        {variant.image ? (
                          <Image
                            src={variant.image}
                            alt={variant.title}
                            fill
                            sizes="120px"
                            className="object-cover object-top"
                          />
                        ) : null}
                      </span>
                      <span className="block truncate px-2 py-2 text-xs font-semibold text-[#3f2617]">
                        {variant.color ?? variant.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {variantAttributes.length > 0 ? (
              <div className="mt-6 grid gap-3">
                {variantAttributes.map((attribute) => (
                  <div
                    key={`${attribute.name}-${attribute.value}`}
                    className="flex min-h-11 items-center justify-between gap-4 border border-[#d8b278] px-4 text-sm"
                  >
                    <span className="text-xs font-medium uppercase text-black">
                      {attribute.name}
                    </span>
                    <span className="text-right font-medium text-[#3f2617]">
                      {attribute.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid gap-2">
              {isInCart ? (
                <ProductQuantityControls
                  quantity={cartQuantity}
                  onDecrease={() =>
                    handleDecreaseCartItem(cartItem)
                  }
                  onIncrease={() =>
                    handleIncreaseCartItem(cartItem)
                  }
                  onRemove={() =>
                    handleRemoveCartItem(cartItem)
                  }
                />
              ) : (
                <Button
                  onClick={() => handleAddToCart(cartItem)}
                  disabled={selectedVariant?.stockQuantity === 0}
                  className="h-12 rounded-none bg-[#c39150] text-sm font-semibold text-white hover:bg-[#3f2617] disabled:opacity-60"
                >
                  {selectedVariant?.stockQuantity === 0
                    ? "Out of stock"
                    : "Add to cart"}
                </Button>
              )}
              <Button
                disabled={selectedVariant?.stockQuantity === 0}
                onClick={() => {
                  window.sessionStorage.setItem(
                    "roopshree-buy-now",
                    JSON.stringify({
                      ...cartItem,
                      quantity: 1,
                      addedAt: Date.now(),
                    }),
                  )
                  router.push("/checkout?source=buy-now")
                }}
                className="h-12 rounded-none bg-[#3f2617] text-sm font-semibold text-white hover:bg-[#c39150] disabled:opacity-60"
              >
                Buy Now
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleToggleWishlist(cartItem)}
                className="h-12 rounded-none border-[#d8b278] bg-white text-sm font-medium text-[#3f2617] hover:bg-[#fbf3ea]"
              >
                <Heart
                  className="size-4 text-[#c39150]"
                  fill={isWishlisted ? "currentColor" : "none"}
                />
                {isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
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

function ProductQuantityControls({
  quantity,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  onRemove: () => void
}) {
  return (
    <div className="grid h-12 grid-cols-[52px_1fr_52px_52px] overflow-hidden border border-[#c39150] bg-white text-[#3f2617]">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        className="flex items-center justify-center border-r border-[#c39150]/35 text-[#c39150]"
      >
        <Minus className="size-4" />
      </button>
      <span className="flex items-center justify-center text-sm font-semibold">
        Quantity {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        className="flex items-center justify-center border-l border-[#c39150]/35 text-[#c39150]"
      >
        <Plus className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Remove from cart"
        onClick={onRemove}
        className="flex items-center justify-center bg-red-50 text-red-500"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

export default ProductDetails
