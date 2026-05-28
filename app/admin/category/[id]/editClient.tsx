/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { getAllCategoriesMeta, updateCategory } from "@/helper/category/action";
import { toast } from "sonner";
import { useFileUpload } from "@/helper/upload/client";

export default function EditCategory({ categoryInfo }: any) {
  const router = useRouter();
  const { upload, uploading } = useFileUpload();
  const bannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: categoryInfo.name,
    parent: categoryInfo.parentId ?? "",
    description: categoryInfo.description ?? "",
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedParent, setSelectedParent] = useState<string>(
    categoryInfo.parentId ?? "", // Spelling fixed: parrentId -> parentId
  );

  const [bannerImageKey, setBannerImageKey] = useState<string>(
    categoryInfo.bannerImage ?? "",
  );
  const [preview, setPreview] = useState<string | null>(
    categoryInfo.bannerPreview ?? null,
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getAllCategoriesMeta();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const categoryData = {
      id: categoryInfo.id,
      name: form.name,
      parentId: selectedParent,
      description: form.description,
      bannerImage: bannerImageKey,
    };

    const response = await updateCategory(categoryData);
    if (response?.success == true) {
      toast.success(response.message ?? "Category updated successfully");
      router.push("/admin/category");
    } else {
      toast.error(response?.message ?? "Failed to update category");
    }
  };

  const handleBanner = async (file?: File) => {
    if (!file) return;

    const previousPreview = preview;
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    try {
      const { fileKey } = await upload(file, "category");

      setBannerImageKey(fileKey);

      toast.success("Image uploaded");
    } catch (err) {
      URL.revokeObjectURL(localPreviewUrl);
      setPreview(previousPreview);
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    }
  };

  return (
    <div className="w-full p-1">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Manage Category
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Update category details and visibility.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => submitHandler(e)}>
            <input type="hidden" name="id" value={categoryInfo.id} />
            <input type="hidden" name="parentId" value={selectedParent} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left column */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Category Name
                  </Label>
                  <Input
                    name="name"
                    defaultValue={categoryInfo.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Parent Category
                  </Label>
                  <Select
                    value={selectedParent}
                    onValueChange={(value) => setSelectedParent(value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Description
                  </Label>
                  <Textarea
                    name="description"
                    defaultValue={categoryInfo.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="min-h-[140px] resize-none"
                  />
                </div>
              </div>

              {/* Right column - Updated Image Logic */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Category Image
                  </Label>

                  {/* ImageUpload component with initial image support */}
                  {/* <ImageUpload 
                    onUploadSuccess={(url) => setPreview(url)} 
                    initialImage={preview} // Agar aap apne ImageUpload component mein ye prop add karein to purani image dikhegi
                  /> */}

                  <div
                    onClick={() => bannerRef.current?.click()}
                    className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    {!preview ? (
                      <p>Click to upload category image</p>
                    ) : (
                      <img
                        src={preview}
                        alt="Category preview"
                        className="w-full h-full object-contain"
                      />
                    )}

                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <input
                    ref={bannerRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />

                  {bannerImageKey ? (
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {bannerImageKey}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 px-0 pt-10">
              <Button
                type="button"
                onClick={() => router.push("/admin/category")}
                variant="outline"
                className="px-12 h-11 rounded-full"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="px-12 h-11 rounded-full bg-[#2D5A5D] hover:bg-[#234749] text-white"
              >
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
