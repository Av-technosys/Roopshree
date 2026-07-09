import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { getProfile } from "@/helper/user/action"
import { requireUser } from "@/lib/auth"

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireUser()
  const profile = await getProfile()

  return <DashboardShell profile={profile}>{children}</DashboardShell>
}
