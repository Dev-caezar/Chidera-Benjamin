// src/components/admin/MobileMenu.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FolderKanban, Plus, ExternalLink } from "lucide-react";
import SignOutButton from "./SignOutButton";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "New project", href: "/admin/projects/new", icon: Plus },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden sticky top-0 z-30 bg-black border-b border-zinc-800">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="font-heading font-semibold text-white">
          Admin
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-zinc-300"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Expands downward, pushing page content below it */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="px-3 pb-4 pt-1 space-y-1 border-t border-zinc-800">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <ExternalLink size={16} strokeWidth={2} />
              View site
            </Link>
            <div className="px-3 py-2.5 pt-2 border-t border-zinc-800 mt-2">
              <SignOutButton />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}