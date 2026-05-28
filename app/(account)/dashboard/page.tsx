import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { getAddresses } from "@/helper/address/action"

export default async function Page() {
  const addresses = await getAddresses()

  return <DashboardOverview addresses={addresses} />
}
