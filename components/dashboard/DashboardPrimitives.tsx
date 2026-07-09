import { cn } from "@/lib/utils";

export function DashboardPageTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h1 className=" hidden lg:block font-heading text-2xl font-semibold text-black">
      {children}
    </h1>
  );
}

export function DashboardCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("border border-[#ead8c4] bg-white shadow-sm", className)}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  className,
  required = false,
  readOnly = false,
}: {
  label: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className={cn("block min-w-0 text-xs text-[#777]", className)}>
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        readOnly={readOnly}
        className="mt-1 h-10 w-full border border-[#e1c5a5] bg-white px-4 text-sm font-medium text-black outline-none transition focus:border-[#C39150]"
      />
    </label>
  );
}

export function PrimaryAction({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-10 bg-[#C39150] px-7 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#3F2617] disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FilterPill({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-8 rounded-full border border-[#C39150] px-5 text-xs font-medium text-[#C39150]",
        active && "bg-[#C39150] text-white",
      )}
    >
      {children}
    </button>
  );
}
