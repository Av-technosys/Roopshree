"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <SelectContext.Provider value={{ value: value ?? defaultValue, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm",
        className,
      )}
    >
      {children}
    </button>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);

  return <span>{value || placeholder}</span>;
}

function SelectContent({ className, children }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mt-1 grid gap-1 rounded-md border border-input bg-background p-1", className)}>
      {children}
    </div>
  );
}

function SelectItem({
  value,
  className,
  children,
}: React.ComponentProps<"button"> & { value: string }) {
  const { onValueChange } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn("rounded px-2 py-1.5 text-left text-sm hover:bg-muted", className)}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
