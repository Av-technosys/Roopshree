"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Box,
  List,
  File,
  FileText,
  User,
  MessageSquare,
  Code,
  IndianRupee,
  Mail,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Blog", href: "/admin/blog", icon: File },
  { label: "Product", href: "/admin/products", icon: Box },
  { label: "Category", href: "/admin/category", icon: List },
  { label: "Order", href: "/admin/orders", icon: FileText },
  { label: "User", href: "/admin/users", icon: User },
  { label: "Review", href: "/admin/reviews", icon: MessageSquare },
  { label: "Payment", href: "/admin/payment", icon: IndianRupee },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Mail },


  // {
  //   label: "Featured Products",
  //   href: "/admin/featured-products",
  //   icon: ShoppingCart,
  // },
  // {
  //   label: "Featured Categories",
  //   href: "/admin/featured-categories",
  //   icon: Feather,
  // },
  // { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const signOutAdmin = async () => {
    await fetch("/api/admin/access", { method: "DELETE" });
    router.replace("/admin/gate");
    router.refresh();
  };

  // normalize path (remove trailing slash)
  const currentPath = pathname.replace(/\/$/, "");

  return (
    <aside className="w-64 h-screen   bg-white border-r p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <p className="text-sm text-gray-500">Manage your account details</p>
      </div>

      {/* Navigation */}
      <nav className="h-[calc(78vh-3rem)] space-y-3 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          let active = false;
          if (href === "/admin") {
            active = currentPath === "/admin";
          } else {
            active = currentPath === href || currentPath.startsWith(`${href}/`);
          }

          return (
            <Link key={href} href={href}>
              <SidebarItem
                icon={<Icon size={24} className="text-orange-400" />}
                label={label}
                active={active}
              />
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => void signOutAdmin()}
        className="mt-4 w-full rounded-full hover:text-white border border-red-300 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500 cursor-pointer"
      >
        Sign out of admin
      </button>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
      ${active
          ? "bg-[#FFF9EE] text-gray-800 font-semibold border-l-4 border-[#D4A056]"
          : "hover:bg-gray-50 text-gray-500"
        }`}
    >
      <span className={active ? "opacity-100" : "opacity-70"}>{icon}</span>
      <span className="text-base">{label}</span>
    </div>
  );
}
