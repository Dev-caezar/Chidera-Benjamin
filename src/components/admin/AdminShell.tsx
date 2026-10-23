// src/components/admin/AdminShell.tsx
"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileTopBar from "./MobileTopBar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-red-100 overflow-x-hidden">
            <div className="md:hidden">
                <Sidebar mobile onNavigate={() => setOpen(false)} />
            </div>
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div
                className={`relative z-10 min-h-screen bg-white transition-all duration-300 ease-in-out md:ml-64 md:transform-none ${open
                    ? "translate-x-[50%] scale-95 rounded-3xl shadow-2xl"
                    : "transform-none rounded-none"
                    }`}
            >
                <MobileTopBar open={open} onToggle={() => setOpen((v) => !v)} />
                <main className="max-w-5xl mx-auto p-6 lg:p-10 relative overflow-hidden rounded-[inherit]">
                    {children}
                </main>

                {open && (
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="md:hidden absolute inset-0 z-50"
                    />
                )}
            </div>
        </div>
    );
}