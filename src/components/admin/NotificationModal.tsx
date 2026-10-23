// src/components/admin/NotificationModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send, Loader2, Mail, ExternalLink } from "lucide-react";
import type { NotificationItem } from "@/types/notification";

function fullDate(dateStr: string) {
    return new Date(dateStr).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

export default function NotificationModal({
    notification,
    onClose,
    onUpdated,
}: {
    notification: NotificationItem | null;
    onClose: () => void;
    onUpdated: (n: NotificationItem) => void;
}) {
    const [mounted, setMounted] = useState(false);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setReply("");
        setError("");
    }, [notification?._id]);

    useEffect(() => {
        if (!notification) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [notification, onClose]);

    if (!mounted || !notification) return null;

    const n = notification;
    const canReply = n.type === "contact" && !!n.meta?.email;

    const mailto = canReply
        ? `mailto:${n.meta!.email}?subject=${encodeURIComponent(
            "Re: your message"
        )}&body=${encodeURIComponent(
            `\n\n---\n${n.meta?.name || "You"} wrote:\n${n.message || ""}`
        )}`
        : "";

    async function sendReply() {
        if (!reply.trim()) return;
        setSending(true);
        setError("");

        const res = await fetch(`/api/notifications/${n._id}/reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: reply }),
        });

        setSending(false);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Failed to send reply");
            return;
        }

        onUpdated(await res.json());
        setReply("");
    }

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6">
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <div className="relative z-10 w-full max-w-xl max-h-[90vh] flex flex-col bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-zinc-200 bg-zinc-50/50">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-zinc-900 truncate">
                            {n.title}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">{fullDate(n.createdAt)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 rounded-xl transition-colors shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {n.type === "contact" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                                    Name
                                </p>
                                <p className="text-sm text-zinc-800 font-medium mt-1 truncate">
                                    {n.meta?.name || "—"}
                                </p>
                            </div>
                            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                                    Email
                                </p>
                                <p className="text-sm text-zinc-800 font-medium mt-1 truncate">
                                    {n.meta?.email || "—"}
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
                            Message
                        </p>
                        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                            {n.message || "No message content."}
                        </div>
                    </div>

                    {n.replies && n.replies.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                                Your replies
                            </p>
                            {n.replies.map((r, i) => (
                                <div key={i} className="ml-6">
                                    <div className="rounded-2xl rounded-tr-sm bg-orange-50 border border-orange-200 p-4 text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">
                                        {r.message}
                                    </div>
                                    <p className="text-[10px] text-zinc-400 mt-1 text-right">
                                        Sent {fullDate(r.sentAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {canReply ? (
                    <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 space-y-3">
                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={3}
                            placeholder={`Reply to ${n.meta?.name || n.meta?.email}...`}
                            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors resize-none shadow-sm"
                        />
                        <div className="flex items-center justify-between">
                            <a
                                href={mailto}
                                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
                            >
                                <ExternalLink size={12} />
                                Open in email app
                            </a>
                            <button
                                onClick={sendReply}
                                disabled={sending || !reply.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50 active:scale-[0.98] transition-all shadow-sm"
                            >
                                {sending ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Send size={14} />
                                )}
                                {sending ? "Sending..." : "Send reply"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                        <Mail size={13} />
                        System notifications can't be replied to.
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}