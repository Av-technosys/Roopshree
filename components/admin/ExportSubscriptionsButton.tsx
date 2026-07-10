"use client";

import { Download } from "lucide-react";

type Subscription = {
  id: string;
  email: string;
  createdAt: Date;
};

export function ExportSubscriptionsButton({ data }: { data: Subscription[] }) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Create CSV header
    const headers = ["ID", "Email", "Subscribed At"];
    
    // Map rows
    const rows = data.map((sub) => [
      sub.id,
      sub.email,
      new Date(sub.createdAt).toLocaleString(),
    ]);

    // Combine to CSV string
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 bg-[#D4A056] text-white px-4 py-2 rounded-md hover:bg-[#C39150] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
    >
      <Download size={18} />
      Export to CSV (Excel)
    </button>
  );
}
