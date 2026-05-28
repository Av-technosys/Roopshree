import Link from "next/link"

import {
  DashboardCard,
  DashboardPageTitle,
} from "@/components/dashboard/DashboardPrimitives"
import {
  DeleteAddressButton,
  SetDefaultAddressButton,
} from "@/components/dashboard/AddressBookActions"
import type { AddressView } from "@/services/address.service"

export function AddressBookPage({ addresses }: { addresses: AddressView[] }) {
  function getCardAddress(address: AddressView) {
    return [address.line1, address.city, address.state].filter(Boolean).join(", ")
  }

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

      {addresses.length === 0 ? (
        <DashboardCard className="mt-5 p-8 text-center text-sm font-medium text-black">
          No addresses saved yet.
        </DashboardCard>
      ) : (
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
                {address.fullName}
              </h2>
              <p className="mt-3 text-sm text-black">{address.phone}</p>
              <p className="mt-4 max-w-sm text-sm leading-6 text-black">
                {getCardAddress(address)}
              </p>
              <div className="mt-7 grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[1fr_0.8fr_auto]">
                {address.isDefault ? null : (
                  <SetDefaultAddressButton addressId={address.id} />
                )}
                <Link
                  href={`/dashboard/address-book/edit?id=${address.id}`}
                  className={`flex h-10 items-center justify-center bg-[#C39150] px-7 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#3F2617] ${
                    address.isDefault ? "col-span-1 sm:col-span-2" : ""
                  }`}
                >
                  Edit
                </Link>
                {!address.isDefault ? (
                  <DeleteAddressButton addressId={address.id} />
                ) : null}
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  )
}
