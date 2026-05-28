"use client";

import { cn } from "@/lib/utils";

type SelectItem = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  selectItems: SelectItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function Select({
  label,
  placeholder = "Select",
  selectItems,
  value,
  onValueChange,
  className,
}: SelectProps) {
  return (
    <label className={cn("block min-w-40 text-xs text-muted-foreground", className)}>
      {label ? <span className="sr-only">{label}</span> : null}
      <select
        value={value ?? ""}
        onChange={(event) => onValueChange?.(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
      >
        <option value="">{placeholder}</option>
        {selectItems.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
