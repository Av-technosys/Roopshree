"use client";

import { useEffect, useState } from "react";

type SidebarItem = {
  id: string;
  label: string;
};

export function PolicySidebar({ items }: { items: SidebarItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 space-y-6">
        <h3 className="font-heading text-lg font-medium text-[#3F2617] border-b border-[#C39150]/20 pb-3">
          On This Page
        </h3>
        <nav className="flex flex-col space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`group flex items-center gap-2 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? "text-[#C39150] translate-x-1"
                    : "text-[#3F2617]/60 hover:text-[#C39150]"
                }`}
              >
                <span
                  className={`size-1.5 rotate-45 bg-[#C39150] transition-all duration-300 ${
                    isActive ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50"
                  }`}
                />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
