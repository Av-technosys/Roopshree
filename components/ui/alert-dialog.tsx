"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AlertDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                open?: boolean;
                setOpen?: (open: boolean) => void;
              }>,
              { open, setOpen },
            )
          : child,
      )}
    </>
  );
}

function AlertDialogTrigger({
  asChild,
  children,
  setOpen,
}: {
  asChild?: boolean;
  children: React.ReactNode;
  setOpen?: (open: boolean) => void;
}) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen?.(true),
    });
  }

  return (
    <Button type="button" variant="outline" onClick={() => setOpen?.(true)}>
      {children}
    </Button>
  );
}

function AlertDialogContent({
  open,
  setOpen,
  className,
  children,
}: React.ComponentProps<"div"> & {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={cn("w-full max-w-md rounded-md bg-background p-6 shadow-xl", className)}
        role="dialog"
        aria-modal="true"
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{ setOpen?: (open: boolean) => void }>,
                { setOpen },
              )
            : child,
        )}
      </div>
    </div>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-6 flex justify-end gap-2", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function AlertDialogCancel({
  setOpen,
  ...props
}: React.ComponentProps<typeof Button> & {
  setOpen?: (open: boolean) => void;
}) {
  return <Button type="button" variant="outline" onClick={() => setOpen?.(false)} {...props} />;
}

function AlertDialogAction({
  setOpen,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & {
  setOpen?: (open: boolean) => void;
}) {
  return (
    <Button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen?.(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
