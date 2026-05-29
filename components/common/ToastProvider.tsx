"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { X } from "lucide-react"

type ToastTone = "success" | "error" | "info"

type Toast = {
  id: string
  title: string
  tone: ToastTone
}

type ToastContextValue = {
  showToast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, tone }: Omit<Toast, "id">) => {
      const id = crypto.randomUUID()

      setToasts((current) => [...current, { id, title, tone }])
      window.setTimeout(() => removeToast(id), 3200)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[10000] grid w-[min(360px,calc(100vw-32px))] gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-[6px] border bg-white px-4 py-3 text-sm shadow-xl ${
              toast.tone === "success"
                ? "border-green-200 text-green-800"
                : toast.tone === "error"
                  ? "border-red-200 text-red-800"
                  : "border-[#ead8c4] text-[#3F2617]"
            }`}
          >
            <p className="min-w-0 flex-1 font-medium">{toast.title}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
              className="rounded-[4px] opacity-70 transition hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider")
  }

  return context
}
