"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createPortal } from "react-dom"
import { X, Star, ThumbsUp } from "lucide-react"

import {
  DashboardCard,
  DashboardPageTitle,
  FilterPill,
  PrimaryAction,
} from "@/components/dashboard/DashboardPrimitives"
import { recentOrders, submittedReview } from "@/components/dashboard/dashboard-data"

export function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "submitted">("pending")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isModalOpen])

  return (
    <div>
      <DashboardPageTitle>Reviews & Ratings</DashboardPageTitle>

      <div className="mt-5 flex flex-wrap gap-3">
        <FilterPill active>All</FilterPill>
        <button
          type="button"
          onClick={() => setActiveTab("submitted")}
          className={`h-8 rounded-full border border-[#C39150] px-5 text-xs font-medium ${
            activeTab === "submitted"
              ? "bg-[#C39150] text-white"
              : "text-[#C39150]"
          }`}
        >
          Submitted
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`h-8 rounded-full border border-[#C39150] px-5 text-xs font-medium ${
            activeTab === "pending" ? "bg-[#C39150] text-white" : "text-[#C39150]"
          }`}
        >
          Pending
        </button>
      </div>

      {activeTab === "submitted" ? (
        <SubmittedReview />
      ) : (
        <div className="mt-5 space-y-5">
          {recentOrders.map((order, index) => (
            <DashboardCard key={`${order.slug}-${index}`}>
              <div className="grid gap-3 bg-[#f1dfc7] px-4 py-3 text-xs text-[#C39150] sm:grid-cols-3">
                <Meta label="Order ID" value={order.id} />
                <Meta label="Date" value={order.date} />
                <Meta label="Total" value={order.total} />
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="flex gap-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#f8f0e6]">
                    <Image
                      src={order.image}
                      alt={order.product}
                      fill
                      sizes="56px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-black">
                      Bandhej Saree
                    </h2>
                    <p className="mt-1 text-xs text-[#777]">Colour: Red</p>
                    <p className="text-xs text-[#777]">Qty: 2</p>
                  </div>
                </div>
                <PrimaryAction onClick={() => setIsModalOpen(true)}>
                  Write a Review
                </PrimaryAction>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}

      {typeof document !== "undefined" && isModalOpen
        ? createPortal(
            <ReviewModal onClose={() => setIsModalOpen(false)} />,
            document.body
          )
        : null}
    </div>
  )
}

function SubmittedReview() {
  return (
    <DashboardCard className="mt-5 grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#f8f0e6]">
          <Image
            src={submittedReview.image}
            alt={submittedReview.product}
            fill
            sizes="80px"
            className="object-cover object-top"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-black">
            {submittedReview.customer}
          </h2>
          <p className="text-xs text-[#777]">Colour: {submittedReview.colour}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Stars filled={submittedReview.rating} />
            <span className="text-sm font-semibold text-black">
              {submittedReview.title}
            </span>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#666]">
            {submittedReview.body}
          </p>
          <p className="mt-3 flex items-center gap-3 text-xs text-[#777]">
            Reviewed on {submittedReview.date}
            <ThumbsUp className="size-4" />
            {submittedReview.helpful} found helpful
          </p>
        </div>
      </div>
      <Link
        href="/shop"
        className="flex h-12 items-center justify-center bg-[#C39150] px-10 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#3F2617]"
      >
        View Products
      </Link>
    </DashboardCard>
  )
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#fbf3ea] px-6 py-5">
          <h2 className="text-xl font-semibold text-[#C39150]">Write a Review</h2>
          <button type="button" aria-label="Close review modal" onClick={onClose}>
            <X className="size-5 text-[#777]" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-[#f8f0e6]">
              <Image
                src={submittedReview.image}
                alt={submittedReview.product}
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-black">Bandhej Saree</h3>
              <p className="mt-1 text-xs text-[#777]">Colour: Red</p>
            </div>
          </div>

          <label className="mt-6 block text-xs text-[#777]">
            Overall Rating *
            <span className="mt-2 flex gap-2 text-[#C39150]">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="size-7" />
              ))}
            </span>
          </label>

          <label className="mt-5 block text-xs text-[#777]">
            Review Title *
            <input
              defaultValue="Summarize your experience"
              className="mt-2 h-10 w-full border border-[#e1c5a5] px-4 text-sm font-semibold text-black outline-none focus:border-[#C39150]"
            />
          </label>

          <label className="mt-5 block text-xs text-[#777]">
            Your Review *
            <textarea
              defaultValue="Tell us what you liked or disliked about this product"
              className="mt-2 h-28 w-full resize-none border border-[#e1c5a5] p-4 text-sm font-semibold text-black outline-none focus:border-[#C39150]"
            />
            <span className="mt-1 block text-right text-[10px] text-[#777]">
              (0/100)
            </span>
          </label>

          <PrimaryAction className="mt-2 w-full">Submit</PrimaryAction>
        </div>
      </div>
    </div>
  )
}

function Stars({ filled }: { filled: number }) {
  return (
    <span className="flex text-[#f5a400]">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className="size-4"
          fill={index < filled ? "currentColor" : "none"}
        />
      ))}
    </span>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-black">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  )
}
