"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, useRef, useState, useTransition } from "react"
import {
  DashboardCard,
  Field,
  PrimaryAction,
} from "@/components/dashboard/DashboardPrimitives"
import { useToast } from "@/components/common/ToastProvider"
import {
  createAddress,
  updateAddress,
} from "@/helper/address/action"
import type { AddressView } from "@/services/address.service"

export function AddressEditPage({
  address,
}: {
  address?: AddressView | null
}) {
  const isEditing = Boolean(address)
  const router = useRouter()
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isSubmitting = isSaving || isPending

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) return

    setIsSaving(true)

    const formData = new FormData(event.currentTarget)
    const payload = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      line1: formData.get("line1"),
      line2: formData.get("line2"),
      locality: formData.get("locality"),
      city: formData.get("city"),
      state: formData.get("state"),
      postalCode: formData.get("postalCode"),
      country: formData.get("country"),
      isDefault: formData.get("isDefault"),
    }

    startTransition(async () => {
      try {
        const result =
          address?.id
            ? await updateAddress(address.id, payload)
            : await createAddress(payload)

        showToast({
          title: result.message,
          tone: result.success ? "success" : "error",
        })

        if (result.success) {
          formRef.current?.reset()
          router.push("/dashboard/address-book")
          router.refresh()
        }
      } catch (error) {
        showToast({
          title:
            error instanceof Error
              ? error.message
              : "Failed to save address",
          tone: "error",
        })
      } finally {
        setIsSaving(false)
      }
    })
  }

  return (
    <DashboardCard className="p-5 sm:p-6">
      <h1 className="text-base font-semibold text-black">
        {isEditing ? "Edit Address" : "Add Address"}
      </h1>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Field
            label="Full Name"
            name="fullName"
            defaultValue={address?.fullName}
            required
          />
          <Field
            label="Phone no."
            name="phone"
            defaultValue={address?.phone}
            required
          />
          <Field
            label="Address / Street"
            name="line1"
            defaultValue={address?.line1}
            className="md:col-span-2"
            required
          />
          <Field
            label="Address Line 2"
            name="line2"
            defaultValue={address?.line2}
            className="md:col-span-2"
          />
          <Field
            label="Locality"
            name="locality"
            defaultValue={address?.locality}
            className="md:col-span-2"
          />
          <Field
            label="City"
            name="city"
            defaultValue={address?.city}
            required
          />
          <Field
            label="State"
            name="state"
            defaultValue={address?.state}
            required
          />
          <Field
            label="Pincode"
            name="postalCode"
            defaultValue={address?.postalCode}
            required
          />
          <Field
            label="Country"
            name="country"
            defaultValue={address?.country ?? "India"}
            className="md:col-span-2"
            required
          />
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm text-black">
          <input
            type="checkbox"
            name="isDefault"
            defaultChecked={address?.isDefault}
            className="size-4 border border-[#e1c5a5] accent-[#C39150]"
          />
          Set as default shipping address
        </label>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <PrimaryAction type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
          </PrimaryAction>
          <Link
            href="/dashboard/address-book"
            className="flex h-10 items-center justify-center border border-[#C39150] text-xs font-semibold tracking-[0.08em] text-[#C39150] transition hover:bg-[#fbf3ea]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </DashboardCard>
  )
}
