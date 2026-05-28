"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type UploadResult = {
  total?: number;
  successCount?: number;
  failedCount?: number;
  failedRows?: { sku?: string; error: string }[];
};

export default function UploadCSVPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  async function handleUpload() {
    if (!file) {
      alert("Please select CSV file");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/products/bulk-upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as UploadResult;
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Bulk Product Upload</h1>
      <div className="mt-6 rounded-xl border p-6">
        <input
          type="file"
          accept=".csv"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <div className="mt-4 flex gap-4">
          <Button type="button" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload CSV"}
          </Button>
          <Button asChild type="button" variant="outline">
            <a href="/api/products/sample-csv">Download Sample CSV</a>
          </Button>
        </div>
      </div>

      {result ? (
        <div className="mt-8">
          <div className="grid grid-cols-3 gap-4">
            <Summary label="Total" value={result.total ?? 0} />
            <Summary label="Success" value={result.successCount ?? 0} />
            <Summary label="Failed" value={result.failedCount ?? 0} />
          </div>

          {result.failedRows?.length ? (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Failed Rows</h2>
              <div className="mt-4 space-y-3">
                {result.failedRows.map((item, index) => (
                  <div key={`${item.sku ?? "row"}-${index}`} className="rounded-lg border p-4">
                    <p>SKU: {item.sku ?? "-"}</p>
                    <p>Error: {item.error}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4">
      <h2 className="font-bold">{label}</h2>
      <p>{value}</p>
    </div>
  );
}
