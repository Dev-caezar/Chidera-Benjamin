"use client";

import Sidebar from "./Sidebar";
import MobileBottomNav from "./BottomNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row font-poppins selection:bg-[#F44A00] selection:text-white">
            <aside className="hidden md:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
                <Sidebar />
            </aside>
            <div className="flex-1 flex flex-col min-w-0 md:pl-64 pb-24 md:pb-0">
                <main className="flex-1 max-w-7xl w-full mx-auto p-5 sm:p-6 lg:p-10">
                    {children}
                </main>
            </div>
            <MobileBottomNav />
        </div>
    );
}