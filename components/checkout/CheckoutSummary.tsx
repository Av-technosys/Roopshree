import { formatPrice } from "@/components/global/const"
import type { CartItem } from "@/store/cartTypes"

type CartSummary = {
  subtotal: number
  shipping: number
  gst: number
  total: number
}

export function CheckoutSummary({
  items,
  summary,
}: {
  items: CartItem[]
  summary: CartSummary
}) {
  return (
    <aside className="min-w-0 bg-[#3F2617] px-5 py-6 text-white shadow-sm md:min-h-[318px]">
      <h2 className="font-heading text-sm font-semibold">Summary</h2>
      <div className="mt-5 space-y-3 text-[11px]">
        {items.map((item) => (
          <SummaryLine
            key={`${item.productId}-${item.addedAt}`}
            label={item.title}
            value={formatPrice(item.price * item.quantity)}
          />
        ))}
        <SummaryLine label="Subtotal" value={formatPrice(summary.subtotal)} />
      </div>
      <div className="mt-7 border-t border-white/35 pt-4 text-xs md:mt-24">
        <SummaryLine label="Total" value={formatPrice(summary.total)} strong />
      </div>
    </aside>
  )
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between gap-6 ${
        strong ? "font-semibold text-white" : "text-white/80"
      }`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className="shrink-0 font-semibold text-white">{value}</span>
    </div>
  )
}
