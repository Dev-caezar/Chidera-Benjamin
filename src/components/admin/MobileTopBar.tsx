// src/components/admin/MobileTopBar.tsx
"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileTopBar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-black border-b border-zinc-800 rounded-t-[inherit]">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="font-heading font-semibold text-white">
          Admin
        </Link>
        <button
          onClick={onToggle}
          className="p-2 text-zinc-300"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>
  );
}