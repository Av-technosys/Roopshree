import { AddressEditPage } from "@/components/dashboard/AddressEditPage"
import { getAddressById } from "@/helper/address/action"
import { notFound } from "next/navigation"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const address = id ? await getAddressById(id) : null

  if (id && !address) {
    notFound()
  }

  return <AddressEditPage address={address} />
}
