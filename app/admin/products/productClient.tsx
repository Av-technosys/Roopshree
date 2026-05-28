"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";
import ProductPagination from "@/components/pagination";
import { Select } from "@/components/select";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/helper/category/action";
import ProductTable, { type ProductRow } from "./productTable";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type ProductClientProps = {
  products: ProductRow[];
  total: number;
  currentPage: number;
};

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export default function ProductClient({
  products,
  total,
  currentPage,
}: ProductClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const debouncedSearch = useDebounce(searchText, 800);
  const selectedCategory = searchParams.get("category") ?? undefined;
  const selectedStatus = searchParams.get("status") ?? undefined;

  useEffect(() => {
    startTransition(() => updateQuery("search", debouncedSearch));
  }, [debouncedSearch, updateQuery]);

  useEffect(() => {
    getCategories().then((data: CategoryOption[]) => {
      setCategories(data.map((category) => ({ value: category.slug, label: category.name })));
    });
  }, []);

  return (
    <div className="w-full p-1">
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage products from the current schema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end gap-4">
            <Button onClick={() => router.push("/admin/products/upload-csv")} variant="outline">
              Upload CSV
            </Button>
            <Button onClick={() => router.push("/admin/products/add")}>
              <Plus />
              Add Product
            </Button>
          </div>

          <div className="mb-6 flex flex-col gap-3 lg:flex-row">
            <div className="w-full max-w-xl">
              <InputGroup className="flex items-center rounded-full bg-white py-2 shadow-none">
                <InputGroupAddon>
                  <Search className="text-gray-500" />
                </InputGroupAddon>
                <InputGroupInput
                  onChange={(event) => setSearchText(event.target.value)}
                  value={searchText}
                  type="text"
                  placeholder="Search by product name or SKU"
                  className="w-full bg-transparent transition-all duration-200 focus:outline-none"
                />
              </InputGroup>
            </div>
            <Select
              placeholder="Select Category"
              label="Category"
              selectItems={categories}
              value={selectedCategory}
              onValueChange={(value) => startTransition(() => updateQuery("category", value))}
            />
            <Select
              placeholder="Select Status"
              label="Status"
              selectItems={statusOptions}
              value={selectedStatus}
              onValueChange={(value) => startTransition(() => updateQuery("status", value))}
            />
          </div>

          <div className="relative">
            {isPending ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : null}
            <ProductTable products={products} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
}
