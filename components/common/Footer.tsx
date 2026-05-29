import Image from "next/image"
import Link from "next/link"

import { FooterNewsletterForm } from "@/components/common/FooterNewsletterForm"
import { Button } from "@/components/ui/button"
import { getCatalogCategories } from "@/services/product.service"
import { IconBrandInstagram, IconMail } from "@tabler/icons-react"

type FooterLink = {
  label: string
  href: string
}

const quickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact Us", href: "/contact" },
  { label: "Enquiry", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
]
const customerServices: FooterLink[] = [
  { label: "Orders", href: "/dashboard" },
  { label: "Terms & Conditions", href: "/" },
  { label: "Shipping", href: "/" },
  { label: "Privacy Policy", href: "/" },
]

const Footer = async () => {
  const categories = (await getCatalogCategories(7)).map((category) => ({
    label: category.name,
    href: category.href,
  }))

  return (
    <footer className="relative overflow-hidden border-t border-[#C39150] bg-[#F1E1CD] text-[#3F2617] md:bg-[#C39150]/15">
      <Image
        src="/footer-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover opacity-80 md:block"
      />
      <div className="relative mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-6 md:grid-cols-[1.25fr_1fr_1fr_1fr_1.4fr] lg:px-8">
        <div>
          <Link href="/" className="relative mb-5 block h-16 w-24">
            <Image
              src="/header-logo.png"
              alt="Roop Shree"
              fill
              sizes="96px"
              className="object-contain object-left"
            />
          </Link>
          <p className="max-w-xs text-sm leading-6 text-[#3F2617]/70">
            Roopshree blends timeless tradition and modern elegance through
            beautifully crafted dupattas designed to add grace, charm, and
            confidence everywhere.
          </p>
          <div className="mt-5 flex gap-3">
            <Button
              aria-label="Instagram"
              size="icon-sm"
              variant="ghost"
              className="bg-[#FEEDD0] hover:bg-[#FEEDD0]"
            >
              <IconBrandInstagram className="size-6 text-[#3F2617]/70" />
            </Button>
            <Button
              aria-label="Email"
              size="icon-sm"
              variant="ghost"
              className="bg-[#FEEDD0] hover:bg-[#FEEDD0]"
            >
              <IconMail className="size-6 text-[#3F2617]/70" />
            </Button>
          </div>
        </div>

        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Categories" items={categories} />
        <FooterColumn title="Customer Services" items={customerServices} />

        <div>
          <h2 className="mb-5 text-xl font-medium text-[#3F2617]">
            Newsletter Subscription
          </h2>
          <FooterNewsletterForm />
          <p className="mt-5 text-sm leading-6 text-[#3F2617]/70">
            Your feedback helps us grow. Share your thoughts and suggestions
            with us anytime.
          </p>
        </div>
      </div>

      <div className="relative border-t border-[#C39150] bg-[#FAEBD8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#3F2617]/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Roopshree. All rights reserved.</p>
          <p>
            Designed & Developed by{" "}
            <span className="font-semibold text-[#3F2617]">AV Technosys</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div>
      <h2 className="mb-5 text-xl font-medium text-[#3F2617]">{title}</h2>
      <ul className="space-y-3 text-sm text-[#3F2617]/70">
        {items.map((item) => (
          <li key={`${title}-${item.href}-${item.label}`}>
            <Link href={item.href} className="transition-colors hover:text-[#C18F50]">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
