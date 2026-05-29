"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUpdateQuery() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback((key: string, value?: string | null) => {
    const currentQuery =
      typeof window === "undefined"
        ? ""
        : window.location.search.replace(/^\?/, "");
    const params = new URLSearchParams(currentQuery);
    const nextValue = value ?? "";

    if ((params.get(key) ?? "") === nextValue) {
      return;
    }

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.delete("page");
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    const currentUrl =
      typeof window === "undefined"
        ? ""
        : `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      router.push(nextUrl);
    }
  }, [pathname, router]);
}
