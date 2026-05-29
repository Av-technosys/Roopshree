"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"

import {
  deleteAddress,
  setDefaultAddress,
} from "@/helper/address/action"
import { useToast } from "@/components/common/ToastProvider"

export function SetDefaultAddressButton({ addressId }: { addressId: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await setDefaultAddress(addressId)

          showToast({
            title: result.message,
            tone: result.success ? "success" : "error",
          })

          if (result.success) {
            router.refresh()
          }
        })
      }}
      className="h-10 w-full border border-[#C39150] text-xs font-semibold tracking-[0.08em] text-[#C39150] disabled:opacity-60"
    >
      Set Default
    </button>
  )
}

export function DeleteAddressButton({ addressId }: { addressId: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      aria-label="Delete address"
      onClick={() => {
        startTransition(async () => {
          const result = await deleteAddress(addressId)

          showToast({
            title: result.message,
            tone: result.success ? "success" : "error",
          })

          if (result.success) {
            router.refresh()
          }
        })
      }}
      className="flex size-10 items-center justify-center border border-red-500 text-red-500 disabled:opacity-60"
    >
      <Trash2 className="size-4" />
    </button>
  )
}
