import { Star, ThumbsUp, UserRound } from "lucide-react"

const specs = [
  ["Fabric", "Silk"],
  ["Work", "Traditional Bandhej Saree with Lagdi Patta Saree"],
  ["Saree Length", "5.5 mtr"],
  ["Blouse", "0.8 mtr (unstitched)"],
  ["Width", "44 inch"],
  ["Occassion", "Wedding, Festive, Party"],
  ["Origin", "Made in India"],
]

const ratingRows = [
  { rating: 5, percent: 78 },
  { rating: 4, percent: 15 },
  { rating: 3, percent: 5 },
  { rating: 2, percent: 1 },
  { rating: 1, percent: 1 },
]

const reviews = [
  {
    name: "Priya S.",
    title: "Elegant & Timeless",
    copy: "The Bandhej saree quality is absolutely stunning with rich colors, premium fabric, and beautiful traditional craftsmanship perfect for festive and wedding occasions.",
  },
  {
    name: "Priya S.",
    title: "Perfect For Celebrations",
    copy: "Received so many compliments at the wedding function. The fabric feels lightweight, elegant, and extremely comfortable to wear for long hours.",
  },
]

const Stars = ({ className = "size-5" }: { className?: string }) => (
  <span className="inline-flex items-center gap-0.5 text-[#f5b940]">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className={`${className} fill-current`} strokeWidth={1.2} />
    ))}
  </span>
)

const ProductDescriptionReviews = () => {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 border border-[#F1E1CD] bg-[#fbf8f4] px-5 py-7 md:grid-cols-[1.2fr_0.9fr] md:px-8 lg:px-12">
          <div>
            <h2 className="font-heading text-2xl  text-black md:text-3xl">
              Description
            </h2>

            <div className="mt-6 border border-[#ead8c2] text-sm font-medium text-black md:text-base">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[35%_65%] border-b border-[#ead8c2] last:border-b-0"
                >
                  <div className="border-r border-[#ead8c2] px-4 py-4 md:px-6">
                    {label}
                  </div>
                  <div className="px-4 py-4 md:px-6">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:pl-8 lg:pl-12">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold leading-none text-black">
                4.8
              </span>
              <div>
                <Stars className="size-7" />
                <p className="mt-1 text-base text-[#7a746f]">234 Reviews</p>
              </div>
            </div>

            <div className="mt-10 space-y-6">
              {ratingRows.map((row) => (
                <div
                  key={row.rating}
                  className="grid grid-cols-[2rem_1.25rem_1fr_3rem] items-center gap-2 text-xl font-medium text-black"
                >
                  <span>{row.rating}</span>
                  <Star className="size-5 fill-[#f5b940] text-[#f5b940]" />
                  <div className="h-2 overflow-hidden rounded-full bg-[#d8d8d8]">
                    <div
                      className="h-full rounded-full bg-[#c39150]"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="text-right text-base">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="font-heading text-xl font-semibold text-black">
            Customer Reviews
          </h2>

          <div className="mt-6 space-y-8">
            {reviews.map((review, index) => (
              <article
                key={`${review.title}-${index}`}
                className="border-b border-[#d8d8d8] pb-8 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f1ddc4] text-[#c39150]">
                    <UserRound className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black">{review.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Stars className="size-4" />
                      <span className="text-xs text-black">(2 Weeks ago)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 max-w-3xl text-sm text-black">
                  <h3 className="font-semibold">{review.title}</h3>
                  <p className="mt-1 leading-5">{review.copy}</p>
                </div>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-black"
                >
                  <ThumbsUp className="size-4" />
                  Helpful (24)
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDescriptionReviews
