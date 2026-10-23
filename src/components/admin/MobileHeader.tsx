// src/components/admin/MobileHeader.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Plus, ExternalLink } from "lucide-react";
import SignOutButton from "./SignOutButton";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden sticky top-0 z-20 bg-black border-b border-zinc-800">
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
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-1 border-t border-zinc-800 pt-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-300"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-300"
          >
            <Plus size={16} /> New project
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-2 py-2 text-sm text-zinc-300"
          >
            <ExternalLink size={16} /> View site
          </Link>
          <div className="px-2 py-2">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
}