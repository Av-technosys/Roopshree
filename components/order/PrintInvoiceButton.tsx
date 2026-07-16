"use client";

import { Printer } from "lucide-react";

export function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] bg-[#C39150] px-5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#3F2617] print:hidden"
    >
      <Printer className="size-4" />
      Print Invoice
    </button>
  );
}
