import Link from "next/link"
import { Trash2 } from "lucide-react"

import {
  DashboardCard,
  DashboardPageTitle,
} from "@/components/dashboard/DashboardPrimitives"
import { addresses } from "@/components/dashboard/dashboard-data"

export function AddressBookPage() {
  return (
    <div>
      <DashboardCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <DashboardPageTitle>Address Book</DashboardPageTitle>
          <p className="mt-2 text-sm font-medium text-black">
            Manage your delivery addresses
          </p>
        </div>
        <Link
          href="/dashboard/address-book/edit"
          className="flex h-10 items-center justify-center bg-[#C39150] px-5 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#3F2617]"
        >
          + Add New Address
        </Link>
      </DashboardCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {addresses.map((address) => (
          <DashboardCard
            key={address.id}
            className={address.isDefault ? "border-[#C39150] p-5" : "p-5"}
          >
            {address.isDefault ? (
              <span className="inline-flex bg-[#C39150] px-4 py-2 text-xs font-semibold text-white">
                Default Address
              </span>
            ) : null}
            <h2 className="mt-5 font-heading text-xl font-medium text-[#C39150]">
              {address.name}
            </h2>
            <p className="mt-3 text-sm text-black">{address.phone}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-black">
              {address.address}
            </p>
            <div className="mt-7 grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[1fr_0.8fr_auto]">
              {address.isDefault ? null : (
                <button
                  type="button"
                  className="h-10 border border-[#C39150] text-xs font-semibold tracking-[0.08em] text-[#C39150]"
                >
                  Set Default
                </button>
              )}
              <Link
                href="/dashboard/address-book/edit"
                className={`flex h-10 items-center justify-center bg-[#C39150] px-7 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#3F2617] ${
                  address.isDefault ? "col-span-1 sm:col-span-2" : ""
                }`}
              >
                Edit
              </Link>
              {!address.isDefault ? (
                <button
                  type="button"
                  aria-label="Delete address"
                  className="flex size-10 items-center justify-center border border-red-500 text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  )
}
