"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"

export default function AdminGate() {
  const router = useRouter()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/admin")
        // Refresh page to ensure route protection middleware captures the new cookie
        setTimeout(() => {
          window.location.href = "/admin"
        }, 150)
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-4 py-12 text-[#3f2617]">
      <div className="w-full max-w-md bg-white p-8 shadow-md border border-[#f3e6d5]">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#c39150]">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-[#3f2617]/70">
            Sign in to access the Roopshree administration panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[4px] bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-id" className="block text-xs font-semibold uppercase tracking-wider text-[#3f2617]/80">
              Admin ID
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c39150]">
                <User className="size-4" />
              </span>
              <input
                id="admin-id"
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Admin ID"
                className="block h-11 w-full border border-[#e1c5a5] pl-10 pr-4 text-sm font-semibold text-black outline-none focus:border-[#c39150] bg-[#faf8f5]/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-[#3f2617]/80">
              Password
            </label>
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#c39150]">
                <Lock className="size-4" />
              </span>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block h-11 w-full border border-[#e1c5a5] pl-10 pr-4 text-sm font-semibold text-black outline-none focus:border-[#c39150] bg-[#faf8f5]/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center bg-[#c39150] px-6 text-sm font-semibold tracking-wider text-white shadow-none transition hover:bg-[#3f2617] disabled:opacity-60 disabled:pointer-events-none active:scale-[0.99]"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </main>
  )
}
