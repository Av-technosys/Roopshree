"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategory } from "@/helper/category/action";

export type CategoryRow = {
  id: string;
  parentId?: string | null;
  parentName?: string | null;
  name: string;
  slug: string;
  description: string | null;
};

type CategoryTableProps = {
  page: number;
  categories: CategoryRow[];
};

const pageSize = 10;
const descriptionPreviewWords = 3;

function getDescriptionPreview(description: string | null) {
  if (!description?.trim()) return "-";

  const words = description.trim().split(/\s+/);

  if (words.length <= descriptionPreviewWords) {
    return description.trim();
  }

  return `${words.slice(0, descriptionPreviewWords).join(" ")}...`;
}

export default function CategoryTable({ page, categories }: CategoryTableProps) {
  const startIndex = (page - 1) * pageSize;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategory(id);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                {category.parentId === category.id
                  ? "No parent"
                  : category.parentName ?? "No parent"}
              </TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{getDescriptionPreview(category.description)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`${pathname}/${category.id}`)}
                  >
                    <Pencil />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={isPending}>
                        <Trash2 className="text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete category permanently?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isPending}
                          onClick={() => handleDelete(category.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-600">
                No categories found.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
