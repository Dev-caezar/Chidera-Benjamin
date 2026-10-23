// src/components/admin/NotificationBell.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

export default function NotificationBell() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    async function fetchCount() {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch {
        }
    }

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [pathname]);

    const active = pathname === "/admin/notifications";

    return (
        <Link
            href="/admin/notifications"
            className={`relative p-2 rounded-lg transition-colors ${active
                ? "bg-orange-700 text-white"
                : "text-zinc-400 hover:text-white hover:bg-orange-500"
                }`}
            aria-label="Notifications"
        >
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-orange-400 text-white text-[10px] font-semibold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </Link>
    );
}