"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  dashboardNavItems,
  signOutItem,
} from "@/components/dashboard/dashboard-data"
import { logout } from "@/lib/logout"
import { useToast } from "@/components/common/ToastProvider"
import type { ProfileView } from "@/services/user.service"

export function DashboardSidebar({
  onNavigate,
  profile,
}: {
  onNavigate?: () => void
  profile: ProfileView | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  const SignOutIcon = signOutItem.icon

  return (
    <aside className="w-full shrink-0 lg:w-[270px]">
      <div className="border border-[#ead8c4] bg-white shadow-sm">
        <div className="flex flex-col items-center px-5 py-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#f3dcc2] text-[#C39150]">
            <UserRound className="size-5" />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[#2d180f]">
            {profile?.fullName ?? "Account"}
          </h2>
          <p className="mt-1 text-xs text-[#6f625b]">{profile?.email ?? ""}</p>
        </div>
      </div>

      <nav className="mt-6 overflow-hidden border border-[#ead8c4] bg-white shadow-sm">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex h-12 items-center gap-3 border-b border-[#ead8c4] px-5 text-sm font-medium transition-colors last:border-b-0",
                isActive
                  ? "bg-[#C39150] text-white"
                  : "text-[#C39150] hover:bg-[#fbf3ea]"
              )}
            >
              <Icon className="size-4" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <ChevronRight className="size-4 opacity-70" />
            </Link>
          )
        })}
        <button
          type="button"
          onClick={async () => {
            onNavigate?.()
            showToast({ title: "Signing out...", tone: "info" })
            await logout()
            showToast({ title: "Signed out successfully", tone: "success" })
            router.push(signOutItem.href)
            router.refresh()
          }}
          className="flex h-12 items-center gap-3 px-5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <SignOutIcon className="size-4" />
          <span className="min-w-0 flex-1 truncate">{signOutItem.label}</span>
          <ChevronRight className="size-4 opacity-70" />
        </button>
      </nav>
    </aside>
  )
}
