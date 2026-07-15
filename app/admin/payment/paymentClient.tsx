"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Search } from "lucide-react";
import ProductPagination from "@/components/pagination";
import { Select } from "@/components/select";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import PaymentTable, { type PaymentRow } from "./paymentTable";

const paymentStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "authorized", label: "Authorized" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

type PaymentClientProps = {
  rows: PaymentRow[];
  total: number;
  currentPage: number;
  pageSize: number;
  paymentStatus: string;
};

export default function PaymentClient({
  rows,
  total,
  currentPage,
  pageSize,
  paymentStatus,
}: PaymentClientProps) {
  const [isPending, startTransition] = useTransition();
  const updateQuery = useUpdateQuery();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 800);
  const selectedStatus = paymentStatus || undefined;

  useEffect(() => {
    startTransition(() => updateQuery("search", debouncedSearch));
  }, [debouncedSearch, updateQuery]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Payments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Payments recorded when customers complete checkout.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-white">
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full max-w-xl">
              <InputGroup className="flex items-center rounded-full bg-white py-2 shadow-none border border-gray-200">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>
                <InputGroupInput
                  onChange={(event) => setSearchText(event.target.value)}
                  value={searchText}
                  type="text"
                  placeholder="Search by order ID, email, name, or gateway IDs"
                  className="w-full bg-transparent transition-all duration-200 focus:outline-none"
                />
              </InputGroup>
            </div>
            <Select
              placeholder="Payment status"
              label="Payment status"
              selectItems={paymentStatusOptions}
              value={selectedStatus}
              onValueChange={(value) =>
                startTransition(() => updateQuery("payment_status", value))
              }
            />
          </div>

          <div className="relative overflow-x-auto">
            {isPending ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : null}
            <PaymentTable page={currentPage} rows={rows} pageSize={pageSize} />
          </div>
          <ProductPagination currentPage={currentPage} totalPages={total} />
        </div>
      </div>
    </div>
  );
}
