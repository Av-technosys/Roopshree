"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 12)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? "border-b border-[#C39150]/25 bg-white/85 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:flex md:justify-between lg:px-8">
        <div className="flex items-center gap-2 justify-self-start md:hidden">
          <Button
            aria-label="Open menu"
            size="icon-sm"
            variant="ghost"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Button aria-label="Search" size="icon-sm" variant="ghost">
            <Search className="size-4" />
          </Button>
        </div>

        <Link href="/" className="relative block h-11 w-20 shrink-0 justify-self-center md:justify-self-auto">
          <Image
            src="/header-logo.png"
            alt="Roop Shree"
            fill
            priority
            sizes="80px"
            className="object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-medium text-[#3F2617] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#C39150]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 justify-self-end">
          <label className="hidden h-9 w-56 items-center gap-2 rounded-full border border-[#C39150] bg-white/70 px-4 text-xs text-[#3F2617] lg:flex">
            <input
              type="search"
              placeholder="Search for sarees..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#3F2617]/70"
            />
            <Search className="size-4" />
          </label>

          <Button aria-label="Account" size="icon-sm" variant="ghost">
            <User className="size-4" />
          </Button>
          <Button aria-label="Cart" size="icon-sm" variant="ghost">
            <ShoppingBag className="size-4" />
          </Button>
          <Button
            aria-label="Wishlist"
            size="icon-sm"
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            <Heart className="size-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <>
            <motion.button
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[1px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82vw] flex-col bg-white px-5 py-4 shadow-2xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <Link
                  href="/"
                  className="relative block h-12 w-20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src="/header-logo.png"
                    alt="Roop Shree"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </Link>
                <Button
                  aria-label="Close menu"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-4 text-sm font-medium text-[#3F2617]">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="transition-colors hover:text-[#C39150]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Button className="mt-auto bg-[#C39150] text-white hover:bg-[#3F2617]">
                <User className="size-4" />
                Account
              </Button>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default Header
