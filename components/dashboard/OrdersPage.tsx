"use client"

import { useState } from "react"
import { DashboardPageTitle, FilterPill } from "@/components/dashboard/DashboardPrimitives"
import { OrderCard } from "@/components/dashboard/OrderCard"
import type { DashboardOrderCardView } from "@/services/order.service"

export function OrdersPage({ orders }: { orders: DashboardOrderCardView[] }) {
  const [selectedStatus, setSelectedStatus] = useState<string>("All")

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "All") return true
    return order.status.toLowerCase() === selectedStatus.toLowerCase()
  })

  return (
    <div>
      <DashboardPageTitle>Recent Orders</DashboardPageTitle>
      <div className="mt-5 flex flex-wrap gap-3">
        <FilterPill 
          active={selectedStatus === "All"} 
          onClick={() => setSelectedStatus("All")}
        >
          All
        </FilterPill>
        <FilterPill 
          active={selectedStatus === "Delivered"} 
          onClick={() => setSelectedStatus("Delivered")}
        >
          Delivered
        </FilterPill>
        <FilterPill 
          active={selectedStatus === "Shipped"} 
          onClick={() => setSelectedStatus("Shipped")}
        >
          Shipped
        </FilterPill>
        <FilterPill 
          active={selectedStatus === "Pending"} 
          onClick={() => setSelectedStatus("Pending")}
        >
          Pending
        </FilterPill>
      </div>
      <div className="mt-5 space-y-5">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <OrderCard
            key={order.slug}
            order={order}
            showInvoice={order.status === "Delivered"}
            secondaryAction={order.status === "Delivered" ? "Review" : "View Details"}
          />
        )) : (
          <div className="border border-[#ead8c4] bg-white p-8 text-center text-sm text-[#777]">
            No {selectedStatus !== "All" ? selectedStatus.toLowerCase() : ""} orders found.
          </div>
        )}
      </div>
    </div>
  )
}
