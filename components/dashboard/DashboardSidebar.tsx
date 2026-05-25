"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, UserRound } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  customer,
  dashboardNavItems,
  signOutItem,
} from "@/components/dashboard/dashboard-data"

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const SignOutIcon = signOutItem.icon

  return (
    <aside className="w-full shrink-0 lg:w-[270px]">
      <div className="border border-[#ead8c4] bg-white shadow-sm">
        <div className="flex flex-col items-center px-5 py-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#f3dcc2] text-[#C39150]">
            <UserRound className="size-5" />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[#2d180f]">
            {customer.name}
          </h2>
          <p className="mt-1 text-xs text-[#6f625b]">{customer.email}</p>
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
        <Link
          href={signOutItem.href}
          onClick={onNavigate}
          className="flex h-12 items-center gap-3 px-5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <SignOutIcon className="size-4" />
          <span className="min-w-0 flex-1 truncate">{signOutItem.label}</span>
          <ChevronRight className="size-4 opacity-70" />
        </Link>
      </nav>
    </aside>
  )
}
