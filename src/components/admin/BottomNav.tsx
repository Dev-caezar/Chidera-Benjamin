// src/components/admin/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Plus, Bell, UserRound } from "lucide-react";

const tabItems = [
    { label: "Home", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "New", href: "/admin/projects/new", icon: Plus, isAction: true },
    { label: "Alerts", href: "/admin/notifications", icon: Bell },
    { label: "Profile", href: "/admin/profile", icon: UserRound },
];

interface MobileBottomNavProps {
    unreadCount?: number;
}

export default function MobileBottomNav({ unreadCount = 0 }: MobileBottomNavProps) {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-4 py-2 shadow-xl font-poppins pb-[env(safe-area-inset-bottom,8px)]">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {tabItems.map((item) => {
                    const active =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    const isAlerts = item.href === "/admin/notifications";

                    if (item.isAction) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F44A00] text-white shadow-lg shadow-[#F44A00]/30 hover:bg-orange-600 active:scale-95 transition-all -translate-y-3 cursor-pointer"
                                aria-label={item.label}
                            >
                                <Icon size={22} strokeWidth={2.5} />
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${active
                                    ? "text-[#F44A00] font-semibold bg-orange-50/80"
                                    : "text-zinc-400 hover:text-zinc-700"
                                }`}
                        >
                            <div className="relative">
                                <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                                {isAlerts && unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#F44A00] text-[9px] font-bold text-white shadow-xs">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}