"use client"

import { FormEvent, useRef, useState, useTransition } from "react"

import { submitNewsletterContactAction } from "@/actions/customer-contact.action"
import { useToast } from "@/components/common/ToastProvider"
import { Button } from "@/components/ui/button"

export function FooterNewsletterForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await submitNewsletterContactAction(formData)

      if (!result.success) {
        setError(result.message)
        showToast({ title: result.message, tone: "error" })
        return
      }

      formRef.current?.reset()
      showToast({ title: result.message, tone: "success" })
    })
  }

  return (
    <form ref={formRef} onSubmit={submit} className="space-y-3">
      <input
        type="email"
        name="email"
        placeholder="Enter your Email"
        required
        autoComplete="email"
        aria-invalid={Boolean(error)}
        className="h-11 w-full border border-[#C39150] bg-white/45 px-4 text-sm outline-none placeholder:text-[#3F2617]/60 focus:border-[#3F2617]"
      />
      {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-none bg-[#3F2617] text-white hover:bg-[#C39150]"
      >
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
