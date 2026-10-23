"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function ColorSwatchCard({ name, hex }: { name: string; hex: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="group relative text-left overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm transition-all hover:border-purple-500/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
            <div
                className="h-24 w-full rounded-xl shadow-inner transition-transform group-hover:scale-95"
                style={{ backgroundColor: hex }}
            />
            <div className="mt-3 flex items-center justify-between px-1">
                <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white">{name}</p>
                    <p className="font-mono text-[11px] uppercase text-zinc-400">{hex}</p>
                </div>
                <div className="text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </div>
            </div>
        </button>
    );
}