import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { overviewStats } from "@/components/dashboard/dashboard-data";
import { OrderCard } from "@/components/dashboard/OrderCard";
import type { AddressView } from "@/services/address.service";
import type { DashboardOrderCardView } from "@/services/order.service";

export function DashboardOverview({
  addresses,
  orders,
  orderCount,
  wishlistCount,
  reviewCount,
}: {
  addresses: AddressView[];
  orders: DashboardOrderCardView[];
  orderCount: number;
  wishlistCount: number;
  reviewCount: number;
}) {
  const stats = overviewStats.map((stat) =>
    stat.label === "Addresses"
      ? { ...stat, value: String(addresses.length) }
      : stat.label === "Orders"
        ? { ...stat, value: String(orderCount) }
        : stat.label === "Wishlist"
          ? { ...stat, value: String(wishlistCount) }
          : stat.label === "Reviews"
            ? { ...stat, value: String(reviewCount) }
            : stat,
  );
  const defaultAddress =
    addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
  return (
    <div>
      <h1 className="hidden font-heading text-2xl font-semibold text-black lg:block">
        Dashboard
      </h1>

      <section className="mt-0 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:mt-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

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
          );
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard key={order.slug} order={order} />
              ))
            ) : (
              <div className="border border-[#ead8c4] bg-white p-6 text-sm text-[#777]">
                No orders yet.
              </div>
            )}
          </div>
        </section>

        <DefaultAddressCard address={defaultAddress} />
      </div>
    </div>
  );
}

function DefaultAddressCard({ address }: { address: AddressView | null }) {
  const addressSummary = address
    ? [address.line1, address.postalCode, address.city, address.state]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <aside className="h-fit bg-[#432414] p-4 text-white shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium">Default Address</h2>
        <Link href="/dashboard/address-book" className="text-xs font-medium">
          Manage
        </Link>
      </div>

      {address ? (
        <>
          <div className="mt-7">
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#2974e6]">
              Default
            </span>
          </div>

          <h3 className="mt-3 text-sm font-semibold">{address.fullName}</h3>
          <p className="mt-2 text-xs text-white/75">{address.phone}</p>
          <p className="mt-2 text-xs leading-5 text-white/75">
            {addressSummary}
          </p>
        </>
      ) : (
        <p className="mt-7 text-xs leading-5 text-white/75">
          No default address saved yet.
        </p>
      )}
    </aside>
  );
}
