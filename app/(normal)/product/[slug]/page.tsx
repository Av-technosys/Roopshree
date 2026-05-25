import ProductDetails from "@/components/product/ProductDetails"
import ProductDescriptionReviews from "@/components/product/ProductDescriptionReviews"
import YouMayAlsoLike from "@/components/product/YouMayAlsoLike"
import {
  BadgeCheck,
  Leaf,
  LockKeyhole,
  Truck,
} from "lucide-react"


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


const Page = () => {
  return (
    <div>

      <ProductDetails />

      <section className="bg-white py-14 md:pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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

      <ProductDescriptionReviews />
      <YouMayAlsoLike />
      


    </div>
  )
}

export default Page
