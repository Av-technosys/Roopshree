import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  defaultAddress,
  overviewStats,
  recentOrders,
} from "@/components/dashboard/dashboard-data"
import { OrderCard } from "@/components/dashboard/OrderCard"

export function DashboardOverview() {
  return (
    <div>
      <h1 className="hidden font-heading text-2xl font-semibold text-black lg:block">
        Dashboard
      </h1>

      <section className="mt-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:mt-5">
        {overviewStats.map((stat) => {
          const Icon = stat.icon

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group border border-[#ead8c4] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <Icon className="size-5 text-[#2d180f]" />
                <ArrowRight className="size-4 text-[#a88d7a] transition group-hover:translate-x-1 group-hover:text-[#C39150]" />
              </div>
              <p className="mt-5 text-2xl font-medium text-[#C39150]">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#777]">
                {stat.label}
              </p>
            </Link>
          )
        })}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-black">Recent Orders</h2>
            <Link
              href="/dashboard/orders"
              className="text-xs font-medium uppercase tracking-[0.08em] text-[#C39150]"
            >
              View All
            </Link>
          </div>
          <div className="space-y-5">
            {recentOrders.map((order, index) => (
              <OrderCard key={`${order.id}-${index}`} order={order} />
            ))}
          </div>
        </section>

        <DefaultAddressCard />
      </div>
    </div>
  )
}

function DefaultAddressCard() {
  return (
    <aside className="h-fit bg-[#432414] p-4 text-white shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium">Default Address</h2>
        <Link href="/dashboard/address-book" className="text-xs font-medium">
          Manage
        </Link>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {defaultAddress.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#2974e6]"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="mt-3 text-sm font-semibold">{defaultAddress.name}</h3>
      <p className="mt-2 text-xs leading-5 text-white/75">
        {defaultAddress.address}
      </p>
    </aside>
  )
}
