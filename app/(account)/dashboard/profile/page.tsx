import { ProfileSettings } from "@/components/dashboard/ProfileSettings"
import { getProfile } from "@/helper/user/action"

export default async function Page() {
  const profile = await getProfile()

  return <ProfileSettings profile={profile} />
}
