// src/components/admin/NotificationsListClient.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Mail, Info, Check, Trash2, CheckCheck, Reply } from "lucide-react";
import NotificationModal from "./NotificationModal";
import type { NotificationItem } from "@/types/notification";

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const sameDay = d.toDateString() === new Date().toDateString();
    return sameDay
        ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function NotificationsListClient({
    notifications: initial,
}: {
    notifications: NotificationItem[];
}) {
    const router = useRouter();
    const [notifications, setNotifications] = useState(initial);
    const [filter, setFilter] = useState<"all" | "unread" | "contact">("all");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = notifications.find((n) => n._id === selectedId) || null;

    const filtered = useMemo(() => {
        return notifications.filter((n) => {
            if (filter === "unread") return !n.read;
            if (filter === "contact") return n.type === "contact";
            return true;
        });
    }, [notifications, filter]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    async function markOneRead(id: string) {
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        await fetch(`/api/notifications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
        });
        router.refresh();
    }

    async function markAllRead() {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        await fetch("/api/notifications", { method: "PATCH" });
        router.refresh();
    }

    async function removeOne(id: string) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (selectedId === id) setSelectedId(null);
        await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        router.refresh();
    }

    function openNotification(n: NotificationItem) {
        setSelectedId(n._id);
        if (!n.read) markOneRead(n._id);
    }

    function handleUpdated(updated: NotificationItem) {
        setNotifications((prev) =>
            prev.map((n) => (n._id === updated._id ? updated : n))
        );
        router.refresh();
    }

    return (
        <div className="max-w-full mx-auto space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between mb-6 gap-4 border-b border-zinc-200 pb-5">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2.5">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                                {unreadCount} unread
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 transition-all shadow-sm shrink-0"
                    >
                        <CheckCheck size={14} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-full p-1.5 w-fit shadow-sm">
                {(["all", "unread", "contact"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${filter === f
                            ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Main List Container */}
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3 text-orange-600">
                            <Info size={22} />
                        </div>
                        <p className="text-sm font-medium text-zinc-800">
                            {notifications.length === 0
                                ? "No notifications yet."
                                : "Nothing matches this filter."}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">Check back later for updates.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {filtered.map((n) => (
                            <div
                                key={n._id}
                                onClick={() => openNotification(n)}
                                className={`flex items-start gap-4 px-6 py-5 cursor-pointer transition-colors hover:bg-zinc-50 ${!n.read ? "bg-orange-50/40 border-l-4 border-l-orange-600" : ""
                                    }`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {n.type === "contact" ? (
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center shadow-sm">
                                            <Mail size={16} className="text-orange-600" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-sm">
                                            <Info size={16} className="text-zinc-600" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <p className="text-sm font-semibold text-zinc-900 tracking-tight truncate">
                                            {n.title}
                                        </p>
                                        {!n.read && (
                                            <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 shadow-sm" />
                                        )}
                                        {n.replied && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                                                <Reply size={10} /> Replied
                                            </span>
                                        )}
                                    </div>
                                    {n.message && (
                                        <p className="text-sm text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>
                                    )}
                                    {n.meta?.email && (
                                        <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs text-zinc-600">
                                            <span className="text-zinc-400">From:</span> {n.meta.email}
                                        </div>
                                    )}
                                    <p className="text-xs text-zinc-400 mt-2 font-medium">
                                        {formatDate(n.createdAt)}
                                    </p>
                                </div>

                                <div
                                    className="flex items-center gap-1.5 shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {!n.read && (
                                        <button
                                            onClick={() => markOneRead(n._id)}
                                            aria-label="Mark as read"
                                            title="Mark as read"
                                            className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-zinc-100 rounded-xl transition-all"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeOne(n._id)}
                                        aria-label="Delete"
                                        title="Delete notification"
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <NotificationModal
                notification={selected}
                onClose={() => setSelectedId(null)}
                onUpdated={handleUpdated}
            />
        </div>
    );
}