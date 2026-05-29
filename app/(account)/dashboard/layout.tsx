import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { getProfile } from "@/helper/user/action"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()

  return <DashboardShell profile={profile}>{children}</DashboardShell>
}
