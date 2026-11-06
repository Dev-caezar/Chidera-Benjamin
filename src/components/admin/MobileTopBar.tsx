// src/components/admin/MobileTopBar.tsx
"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function MobileTopBar() {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 font-poppins shadow-xs">
      <div className="flex items-center justify-between px-5 py-3.5">
        <Link href="/admin" className="font-heading font-bold text-sm tracking-tight text-zinc-900 flex items-center gap-1.5">
          <span>Chidera</span>
          <span className="text-[#F44A00]">Admin</span>
        </Link>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200/60">
          <Sparkles size={12} className="text-[#F44A00]" />
          <span>Portal</span>
        </div>
      </div>
    </div>
  );
}