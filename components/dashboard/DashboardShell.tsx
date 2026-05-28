"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import type { ProfileView } from "@/services/user.service"

const sectionLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "Profile Settings",
  "/dashboard/orders": "My Orders",
  "/dashboard/address-book": "Address Book",
  "/dashboard/wishlist": "Wishlist",
  "/dashboard/reviews": "Reviews & Ratings",
  "/dashboard/notifications": "Notification",
}

export function DashboardShell({
  children,
  profile,
}: {
  children: React.ReactNode
  profile: ProfileView | null
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const activeSection =
    Object.entries(sectionLabels)
      .filter(([href]) => pathname === href || pathname.startsWith(`${href}/`))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Dashboard"

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isSidebarOpen])

  const mobileSidebar = (
    <AnimatePresence>
      {isSidebarOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close dashboard menu"
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] lg:hidden"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 w-[300px] max-w-[86vw] overflow-y-auto bg-[#f8f0e6] px-4 py-5 shadow-2xl lg:hidden"
            style={{ zIndex: 9999 }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="font-heading text-xl font-semibold text-[#2d180f]">
                Account
              </p>
              <Button
                type="button"
                aria-label="Close dashboard menu"
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            <DashboardSidebar
              profile={profile}
              onNavigate={() => setIsSidebarOpen(false)}
            />
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )

  return (
    <main className="flex-1 bg-[#f8f0e6] pt-16 text-[#2d180f]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-semibold text-black"
        >
          <Link href="/" className="transition-colors hover:text-[#C39150]">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/auth" className="transition-colors hover:text-[#C39150]">
            Account
          </Link>
          <ChevronRight className="size-3" />
          <span>{activeSection}</span>
        </nav>

        <div className="mt-4 flex items-center justify-between gap-4 lg:hidden">
          <h1 className="font-heading text-2xl font-semibold text-black">
            {activeSection}
          </h1>
          <Button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="h-10 rounded-[4px] bg-[#C39150] px-4 text-white hover:bg-[#3F2617]"
          >
            <Menu className="size-4" />
            Menu
          </Button>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <DashboardSidebar profile={profile} />
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(mobileSidebar, document.body)
        : null}
    </main>
  )
}
