import { ProfileSettings } from "@/components/dashboard/ProfileSettings"
import { getProfile, updateProfile } from "@/helper/user/action"
import { redirect } from "next/navigation"

function getProfilePayload(formData: FormData) {
  return {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  }
}

export default async function Page() {
  const profile = await getProfile()

  async function saveProfile(formData: FormData) {
    "use server"

    const result = await updateProfile(getProfilePayload(formData))

    if (result.success) {
      redirect("/dashboard/profile")
    }
  }

  return <ProfileSettings profile={profile} action={saveProfile} />
}
