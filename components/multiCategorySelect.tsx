"use client";

import { useEffect, useState } from "react";
import { getAllCategoriesMeta } from "@/helper/category/action";

type CategoryOption = {
  id: string;
  name: string;
};

type MultiCategorySelectProps = {
  value?: string[];
  selectedCategories?: string[];
  onChange?: (value: string[]) => void;
  onCategoriesChange?: (value: string[]) => void;
  setSelectedCategories?: (value: string[]) => void;
};

export function MultiCategorySelect({
  value,
  selectedCategories,
  onChange,
  onCategoriesChange,
  setSelectedCategories,
}: MultiCategorySelectProps) {
  const selected = value ?? selectedCategories ?? [];
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    getAllCategoriesMeta().then(setCategories);
  }, []);

  function toggle(id: string) {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];

    onChange?.(next);
    onCategoriesChange?.(next);
    setSelectedCategories?.(next);
  }

  return (
    <div className="grid gap-2 rounded-md border border-input p-3">
      {categories.map((category) => (
        <label key={category.id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(category.id)}
            onChange={() => toggle(category.id)}
          />
          {category.name}
        </label>
      ))}
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories found.</p>
      ) : null}
    </div>
  );
}
