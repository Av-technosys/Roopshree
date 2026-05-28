"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { MobileSidebar } from "@/components/admin/mobileSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGate =
    pathname === "/admin/gate" || pathname.startsWith("/admin/gate/");

  if (isGate) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-full overflow-hidden bg-muted/40">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 border-b bg-background p-3 lg:hidden">
          <MobileSidebar />
          <span className="text-lg font-semibold">Admin</span>
        </div>

        <div className="">{children}</div>
      </div>
    </div>
  );
}
