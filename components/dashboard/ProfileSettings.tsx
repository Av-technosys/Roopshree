"use client"

import { type FormEvent, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  DashboardCard,
  DashboardPageTitle,
  Field,
  PrimaryAction,
} from "@/components/dashboard/DashboardPrimitives"
import { useToast } from "@/components/common/ToastProvider"
import { updateProfile } from "@/helper/user/action"
import type { ProfileView } from "@/services/user.service"

export function ProfileSettings({
  profile,
}: {
  profile: ProfileView | null
}) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await updateProfile({
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
      })

      showToast({
        title: result.message,
        tone: result.success ? "success" : "error",
      })

      if (result.success) {
        router.refresh()
      }
    })
  }

  return (
    <div>
      <DashboardPageTitle>Profile Settings</DashboardPageTitle>

      <div className="mt-5 space-y-5">
        <DashboardCard className="p-5 sm:p-6">
          <h2 className="font-heading text-xl font-medium text-black">
            Personal Information
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                label="Full Name"
                name="fullName"
                defaultValue={profile?.fullName}
                required
              />
              <Field
                label="Mobile Number (e.g. 9876543210)"
                name="phone"
                defaultValue={profile?.phone}
                required
              />
              <Field
                label="Email"
                type="email"
                defaultValue={profile?.email}
                className="md:col-span-2"
                readOnly
              />
            </div>
            <PrimaryAction type="submit" className="mt-4" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </PrimaryAction>
          </form>
        </DashboardCard>

        <DashboardCard className="p-5 sm:p-6">
          <h2 className="font-heading text-xl font-medium text-black">
            Change Password
          </h2>
          <div className="mt-5 grid max-w-md gap-4">
            <Field label="Current Password" type="password" />
            <Field label="New Password" type="password" />
            <Field label="Confirm New Password" type="password" />
          </div>
          <PrimaryAction className="mt-4">Update Password</PrimaryAction>
        </DashboardCard>

        <DashboardCard className="p-5 sm:p-6">
          <h2 className="font-heading text-xl font-medium text-red-500">
            Delete Account
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#555]">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <button
            type="button"
            className="mt-5 h-10 bg-red-500 px-7 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-red-600"
          >
            Request Account Deletion
          </button>
        </DashboardCard>
      </div>
    </div>
  )
}
