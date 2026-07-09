import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
// import { ensureAdmin } from "@/lib/auth"; // TODO: re-enable auth

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // await ensureAdmin(); // TODO: re-enable auth
  
  return (
    <Suspense>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
