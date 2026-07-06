import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { ensureAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await ensureAdmin();
  
  return (
    <Suspense>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
