"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { CheckoutReviewModal } from "@/components/checkout/CheckoutReviewModal"
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary"
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps"
import { getCartSummary } from "@/components/global/const"
import { useCartStore } from "@/store/cartStore"
import type { CartItem } from "@/store/cartTypes"

export type CheckoutShippingDetails = {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

export function CheckoutFlow() {
  const searchParams = useSearchParams()
  const source = searchParams.get("source") === "buy-now" ? "buy-now" : "cart"
  const cartItems = useCartStore((state) => state.items)
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null)
  const items = source === "buy-now" ? (buyNowItem ? [buyNowItem] : []) : cartItems
  const summary = getCartSummary(items)
  const [isReviewing, setIsReviewing] = useState(false)
  const [shipping, setShipping] = useState<CheckoutShippingDetails>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  })

  useEffect(() => {
    if (source !== "buy-now") return

    const timer = window.setTimeout(() => {
      const item = window.sessionStorage.getItem("roopshree-buy-now")

      if (!item) {
        setBuyNowItem(null)
        return
      }

      try {
        setBuyNowItem(JSON.parse(item) as CartItem)
      } catch {
        setBuyNowItem(null)
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [source])

  return (
    <>
      {isReviewing ? (
        <CheckoutReviewModal
          items={items}
          summary={summary}
          source={source}
          shipping={shipping}
          onClose={() => setIsReviewing(false)}
        />
      ) : (
        <>
          <CheckoutSteps activeStep={1} />

          <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-[480px_210px] md:items-start md:justify-center">
            <section className="min-w-0">
              <h1 className="font-heading text-xl font-semibold leading-none text-black">
                Shipping Details
              </h1>
              <form className="mt-5 grid gap-4 md:mt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckoutInput
                    label="Full Name"
                    value={shipping.fullName}
                    onChange={(value) =>
                      setShipping((current) => ({
                        ...current,
                        fullName: value,
                      }))
                    }
                  />
                  <CheckoutInput
                    label="Phone no."
                    value={shipping.phone}
                    onChange={(value) =>
                      setShipping((current) => ({ ...current, phone: value }))
                    }
                  />
                </div>
                <CheckoutInput
                  label="Address Line 1"
                  value={shipping.addressLine1}
                  onChange={(value) =>
                    setShipping((current) => ({
                      ...current,
                      addressLine1: value,
                    }))
                  }
                />
                <CheckoutInput
                  label="Address Line 2 (Optional)"
                  value={shipping.addressLine2}
                  onChange={(value) =>
                    setShipping((current) => ({
                      ...current,
                      addressLine2: value,
                    }))
                  }
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckoutInput
                    label="City"
                    value={shipping.city}
                    onChange={(value) =>
                      setShipping((current) => ({ ...current, city: value }))
                    }
                  />
                  <CheckoutInput
                    label="State"
                    value={shipping.state}
                    onChange={(value) =>
                      setShipping((current) => ({ ...current, state: value }))
                    }
                  />
                </div>
                <CheckoutInput
                  label="Pincode"
                  value={shipping.postalCode}
                  onChange={(value) =>
                    setShipping((current) => ({
                      ...current,
                      postalCode: value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setIsReviewing(true)}
                  disabled={items.length === 0}
                  className="mt-2 h-11 bg-[#C39150] px-6 text-sm font-semibold tracking-[0.05em] text-white transition hover:bg-[#3F2617] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Review Order
                </button>
              </form>
            </section>

            <CheckoutSummary items={items} summary={summary} />
          </div>
        </>
      )}
    </>
  )
}

function CheckoutInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C39150]">
        {label}
      </span>
      <input
        type="text"
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full border border-[#C39150]/80 bg-white/70 px-4 text-sm font-medium text-[#3F2617] outline-none transition placeholder:text-[#3F2617]/70 focus:border-[#3F2617] md:h-10 md:text-xs"
      />
    </label>
  )
}
