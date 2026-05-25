"use client"

import { useState } from "react"
import { Bell, Megaphone, Package } from "lucide-react"

import { DashboardCard, DashboardPageTitle } from "@/components/dashboard/DashboardPrimitives"
import { notifications } from "@/components/dashboard/dashboard-data"

const icons = {
  orders: Package,
  promotions: Megaphone,
  newsletter: Bell,
}

export function NotificationsPage() {
  const [settings, setSettings] = useState(notifications)

  return (
    <div>
      <DashboardPageTitle>Notification</DashboardPageTitle>
      <div className="mt-5 space-y-5">
        {settings.map((item) => {
          const Icon = icons[item.id as keyof typeof icons]

          return (
            <DashboardCard
              key={item.id}
              className="flex items-center gap-4 p-5 sm:gap-6"
            >
              <Icon className="size-5 shrink-0 text-[#777]" />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-5 text-[#666]">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                aria-pressed={item.enabled}
                onClick={() =>
                  setSettings((current) =>
                    current.map((setting) =>
                      setting.id === item.id
                        ? { ...setting, enabled: !setting.enabled }
                        : setting
                    )
                  )
                }
                className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                  item.enabled ? "bg-[#C39150]" : "bg-[#707070]"
                }`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white transition ${
                    item.enabled ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </DashboardCard>
          )
        })}
      </div>
    </div>
  )
}
