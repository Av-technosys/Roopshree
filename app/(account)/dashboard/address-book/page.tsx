import { AddressBookPage } from "@/components/dashboard/AddressBookPage"
import { getAddresses } from "@/helper/address/action"

export default async function Page() {
  const addresses = await getAddresses()

  return <AddressBookPage addresses={addresses} />
}
