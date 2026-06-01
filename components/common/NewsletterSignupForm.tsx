"use client"

import { type FormEvent, useRef, useState, useTransition } from "react"

import { submitNewsletterContactAction } from "@/actions/customer-contact.action"
import { useToast } from "@/components/common/ToastProvider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NewsletterSignupFormProps = {
  layout?: "stacked" | "inline"
  inputClassName?: string
  buttonClassName?: string
  errorClassName?: string
  buttonText?: string
  pendingText?: string
  placeholder?: string
}

export function NewsletterSignupForm({
  layout = "stacked",
  inputClassName,
  buttonClassName,
  errorClassName,
  buttonText = "Submit",
  pendingText = "Submitting...",
  placeholder = "Enter your Email",
}: NewsletterSignupFormProps) {
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
    <form
      ref={formRef}
      onSubmit={submit}
      className={layout === "inline" ? "flex gap-2 md:gap-3" : "space-y-3"}
    >
      <div className={layout === "inline" ? "min-w-0 flex-1" : undefined}>
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          required
          autoComplete="email"
          aria-invalid={Boolean(error)}
          className={inputClassName}
        />
        {error ? (
          <p
            className={cn(
              layout === "inline" ? "mt-2" : "",
              errorClassName ?? "text-xs font-medium text-red-700",
            )}
          >
            {error}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className={buttonClassName}>
        {isPending ? pendingText : buttonText}
      </Button>
    </form>
  )
}
