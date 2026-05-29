import Image from "next/image"
import Link from "next/link"

import type { DashboardOrderCardView } from "@/services/order.service"

export function OrderCard({
  order,
  primaryAction = "Track Order",
  secondaryAction = "View Details",
}: {
  order: DashboardOrderCardView
  primaryAction?: string
  secondaryAction?: string
}) {
  const statusClass =
    order.statusTone === "green"
      ? "bg-[#c9ffd8] text-[#138a3c]"
      : "bg-[#acd8ff] text-[#1266b4]"

  return (
    <article className="overflow-hidden border border-[#e5d2bd] bg-white shadow-sm">
      <div className="grid gap-3 bg-[#f1dfc7] px-4 py-3 text-xs text-[#C39150] sm:grid-cols-[1fr_0.8fr_0.8fr_auto] sm:items-center">
        <OrderMeta label="Order ID" value={order.id} />
        <OrderMeta label="Date" value={order.date} />
        <OrderMeta label="Total" value={order.total} />
        <span
          className={`w-fit rounded-full px-4 py-1 text-[11px] font-medium ${statusClass}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid gap-4 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex min-w-0 gap-4">
          <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#f8f0e6]">
            <Image
              src={order.image}
              alt={order.product}
              fill
              sizes="56px"
              className="object-cover object-top"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-semibold leading-tight text-[#2d180f]">
              {order.product}
            </h3>
            {order.variant ? (
              <p className="mt-1 text-xs text-[#777]">
                Variant: {order.variant}
              </p>
            ) : null}
            <p className="text-xs text-[#777]">Qty: {order.quantity}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
          <Link
            href={`/dashboard/orders/${order.slug}`}
            className="flex h-10 items-center justify-center border border-[#C39150] px-5 text-xs font-medium tracking-[0.1em] text-[#C39150] transition hover:bg-[#fbf3ea]"
          >
            {secondaryAction}
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex h-10 items-center justify-center bg-[#C39150] px-5 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#3F2617]"
          >
            {primaryAction}
          </Link>
        </div>
      </div>
    </article>
  )
}

function OrderMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-black">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  )
}
