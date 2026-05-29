"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2, Plus, Search } from "lucide-react";
import ProductPagination from "@/components/pagination";
import { Select } from "@/components/select";
import { useDebounce } from "@/components/debouceSearch";
import { useUpdateQuery } from "@/components/filter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getCategories } from "@/helper/category/action";
import CategoryTable, { type CategoryRow } from "./categoryTable";

type CategoryClientProps = {
  categories: CategoryRow[];
  total: number;
  currentPage: number;
};

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export default function CategoryClient({
  categories,
  total,
  currentPage,
}: CategoryClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const debouncedSearch = useDebounce(searchText, 800);
  const selectedCategory = searchParams.get("category") ?? undefined;

  useEffect(() => {
    startTransition(() => updateQuery("search", debouncedSearch));
  }, [debouncedSearch, updateQuery]);

  useEffect(() => {
    getCategories().then((data: CategoryOption[]) => {
      setCategoryOptions(
        data.map((category) => ({
          value: category.slug,
          label: category.name,
        })),
      );
    });
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Manage product category hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button asChild>
              <Link href={`${pathname}/add`}>
                <Plus />
                Add Category
              </Link>
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
                  placeholder="Search by category name"
                  className="w-full bg-transparent transition-all duration-200 focus:outline-none"
                />
              </InputGroup>
            </div>

            <Select
              placeholder="Select Category"
              label="Category"
              selectItems={categoryOptions}
              value={selectedCategory}
              onValueChange={(value) => startTransition(() => updateQuery("category", value))}
            />
          </div>

          <div className="relative">
            {isPending ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : null}
            <CategoryTable page={currentPage} categories={categories} />
          </div>

          <ProductPagination currentPage={currentPage} totalPages={total} />
        </CardContent>
      </Card>
    </div>
  );
}
