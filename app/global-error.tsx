"use client"

import Link from "next/link"

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-svh flex-col items-center justify-center bg-[#fff7ef] px-6 text-center text-[#3F2617]">
          <h1 className="font-heading text-3xl font-semibold">Something went wrong</h1>
          <p className="mt-3 max-w-md text-sm text-[#3F2617]/70">
            Please refresh the page or return home.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-[3px] bg-[#C39150] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </main>
      </body>
    </html>
  )
}
