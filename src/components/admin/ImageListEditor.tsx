// src/components/admin/ImageListEditor.tsx
"use client";

import { useState } from "react";
import { Upload, Loader2, X, ChevronUp, ChevronDown } from "lucide-react";
import { uploadImage } from "@/api-client/upload";
import type { ImageBlock } from "@/types/project";

const inputClass =
    "w-full rounded-xl border border-zinc-200/80 px-4 py-2.5 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all font-poppins";

type Props = {
    value: ImageBlock[];
    onChange: React.Dispatch<React.SetStateAction<ImageBlock[]>>;
    onUploadingChange?: (uploading: boolean) => void;
    onError?: (message: string) => void;
    emptyHint?: string;
    addLabel?: string;
};

export default function ImageListEditor({
    value,
    onChange,
    onUploadingChange,
    onError,
    emptyHint = "No images yet.",
    addLabel = "Add images",
}: Props) {
    const [uploading, setUploading] = useState(false);

    function setBusy(busy: boolean) {
        setUploading(busy);
        onUploadingChange?.(busy);
    }

    async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (files.length === 0) return;

        setBusy(true);
        onError?.("");
        try {
            const urls = await Promise.all(files.map((f) => uploadImage(f)));
            onChange((prev) => [
                ...prev,
                ...urls.map((url) => ({ url, alt: "", caption: "" })),
            ]);
        } catch (err) {
            onError?.(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setBusy(false);
        }
    }

    const update = (i: number, patch: Partial<ImageBlock>) =>
        onChange((prev) => prev.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));

    const remove = (i: number) =>
        onChange((prev) => prev.filter((_, idx) => idx !== i));

    const move = (i: number, dir: -1 | 1) =>
        onChange((prev) => {
            const j = i + dir;
            if (j < 0 || j >= prev.length) return prev;
            const next = [...prev];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
        });

    return (
        <div className="space-y-3">
            {value.length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-400">{emptyHint}</p>
            )}

            {value.map((b, i) => (
                <div
                    key={`${b.url}-${i}`}
                    className="flex gap-3 rounded-2xl border border-zinc-200/80 p-2.5"
                >
                    <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-50">
                        <img src={b.url} alt={b.alt || "Preview"} className="h-full w-full object-contain" />
                    </div>

                    <div className="flex-1 space-y-2">
                        <input
                            value={b.alt || ""}
                            onChange={(e) => update(i, { alt: e.target.value })}
                            placeholder="Alt text (describe what the image shows)"
                            className={inputClass}
                        />
                        <input
                            value={b.caption || ""}
                            onChange={(e) => update(i, { caption: e.target.value })}
                            placeholder="Caption (optional)"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex shrink-0 flex-col">
                        <button
                            type="button"
                            onClick={() => move(i, -1)}
                            disabled={i === 0}
                            aria-label="Move up"
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                        >
                            <ChevronUp size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => move(i, 1)}
                            disabled={i === value.length - 1}
                            aria-label="Move down"
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                        >
                            <ChevronDown size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            aria-label="Remove image"
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ))}

            <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 transition-all hover:border-zinc-400 hover:bg-zinc-50/50">
                {uploading ? (
                    <Loader2 size={20} className="mb-1.5 animate-spin text-zinc-600" />
                ) : (
                    <Upload size={20} className="mb-1.5" />
                )}
                <span className="text-xs font-medium text-zinc-600">
                    {uploading ? "Uploading..." : addLabel}
                </span>
                <span className="mt-0.5 text-[11px]">PNG, JPG, or WEBP · select several at once</span>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    disabled={uploading}
                    className="hidden"
                />
            </label>
        </div>
    );
}