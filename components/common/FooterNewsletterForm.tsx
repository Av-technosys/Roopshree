import { NewsletterSignupForm } from "@/components/common/NewsletterSignupForm"

export function FooterNewsletterForm() {
  return (
    <NewsletterSignupForm
      inputClassName="h-11 w-full border border-[#C39150] bg-white/45 px-4 text-sm outline-none placeholder:text-[#3F2617]/60 focus:border-[#3F2617]"
      buttonClassName="h-11 w-full rounded-none bg-[#3F2617] text-white hover:bg-[#C39150]"
    />
  )
}
